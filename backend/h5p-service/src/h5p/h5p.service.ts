import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as H5P from '@lumieducation/h5p-server';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

// Dùng LaissezFairePermissionSystem mặc định (cho phép mọi thao tác) — IUser v10
// chỉ còn id/name/type/email, không có field quyền hạn riêng lẻ như bản cũ.
const makeTeacherUser = (id: string, name: string): H5P.IUser => ({
  id,
  name,
  type: 'local',
  email: `${id}@titkul.com`,
});

const makeStudentUser = (id: string): H5P.IUser => ({
  id,
  name: 'Học sinh',
  type: 'local',
  email: `student-${id}@titkul.com`,
});

@Injectable()
export class H5pService implements OnModuleInit {
  private readonly logger = new Logger(H5pService.name);
  private h5pEditor: H5P.H5PEditor;
  private h5pPlayer: H5P.H5PPlayer;
  private readonly initPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {
    // Khởi tạo ngay ở constructor để main.ts có thể await trực tiếp, không phụ
    // thuộc thời điểm Nest gọi onModuleInit.
    this.initPromise = this.initialize();
  }

  async onModuleInit() {
    await this.initPromise;
  }

  // Cho main.ts chờ Editor/Player sẵn sàng mà không cần đợi app.init().
  async ready(): Promise<void> {
    await this.initPromise;
  }

  private async initialize() {
    const contentPath = path.resolve(this.configService.get('H5P_CONTENT_PATH', './h5p/content'));
    const libraryPath = path.resolve(this.configService.get('H5P_LIBRARY_PATH', './h5p/libraries'));
    const tempPath = path.resolve(this.configService.get('H5P_TEMP_PATH', './h5p/temporary'));

    [contentPath, libraryPath, tempPath].forEach(p => {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    const h5pConfig = new H5P.H5PConfig(new H5P.fsImplementations.InMemoryStorage());
    // baseUrl mặc định là path tương đối, cần tuyệt đối vì React chạy khác origin.
    h5pConfig.baseUrl = this.configService.get('H5P_BASE_URL', 'http://localhost:3001/h5p');

    const libraryStorage = new H5P.fsImplementations.FileLibraryStorage(libraryPath);
    const contentStorage = new H5P.fsImplementations.FileContentStorage(contentPath);
    const tempStorage = new H5P.fsImplementations.DirectoryTemporaryFileStorage(tempPath);

    this.h5pEditor = new H5P.H5PEditor(
      new H5P.fsImplementations.InMemoryStorage(),
      h5pConfig,
      libraryStorage,
      contentStorage,
      tempStorage,
    );
    // Trả về JSON model thay vì HTML string để h5p-webcomponents (React) dùng được
    this.h5pEditor.setRenderer((model) => model);

    this.h5pPlayer = new H5P.H5PPlayer(libraryStorage, contentStorage, h5pConfig);
    this.h5pPlayer.setRenderer((model) => model);

    this.logger.log('H5P Editor và Player đã khởi tạo thành công');
  }

  getEditor(): H5P.H5PEditor {
    return this.h5pEditor;
  }

  getPlayer(): H5P.H5PPlayer {
    return this.h5pPlayer;
  }

  async saveContent(
    params: any,
    metadata: any,
    library: string,
    teacherId: string,
    teacherName: string,
  ): Promise<{ contentId: string; metadata: any }> {
    const user = makeTeacherUser(teacherId, teacherName);
    const { id, metadata: savedMetadata } = await this.h5pEditor.saveOrUpdateContentReturnMetaData(
      undefined as unknown as H5P.ContentId,
      params,
      metadata,
      library,
      user,
    );
    await this.notifySpringBoot(id, savedMetadata, library, teacherId);
    return { contentId: id, metadata: savedMetadata };
  }

  async updateContent(
    contentId: string,
    params: any,
    metadata: any,
    library: string,
    teacherId: string,
    teacherName: string,
  ): Promise<{ contentId: string; metadata: any }> {
    const user = makeTeacherUser(teacherId, teacherName);
    const { id, metadata: savedMetadata } = await this.h5pEditor.saveOrUpdateContentReturnMetaData(
      contentId,
      params,
      metadata,
      library,
      user,
    );
    await this.notifySpringBoot(id, savedMetadata, library, teacherId);
    return { contentId: id, metadata: savedMetadata };
  }

  // Lấy model cho H5P Editor (web component): render() + (nếu sửa bài) getContent()
  async getEditorModel(
    contentId: string | undefined,
    teacherId: string,
    teacherName: string,
  ): Promise<any> {
    const user = makeTeacherUser(teacherId, teacherName);
    const model: any = await this.h5pEditor.render(
      contentId as H5P.ContentId,
      'vi',
      user,
    );
    if (contentId) {
      const existing = await this.h5pEditor.getContent(contentId, user);
      model.library = existing.library;
      model.params = existing.params;
    }
    return model;
  }

  async deleteContent(contentId: string): Promise<void> {
    await this.h5pEditor.deleteContent(contentId, makeTeacherUser('admin', 'Admin'));
  }

  async getPlayerConfig(contentId: string, userId: string): Promise<any> {
    return this.h5pPlayer.render(contentId, makeStudentUser(userId), 'vi');
  }

  async listContent(): Promise<string[]> {
    return this.h5pEditor.contentManager.listContent(makeTeacherUser('admin', 'Admin'));
  }

  // Thông báo Spring Boot sau khi GV lưu H5P content mới
  private async notifySpringBoot(
    contentId: string,
    metadata: any,
    library: string,
    teacherId: string,
  ): Promise<void> {
    const springBootUrl = this.configService.get('SPRING_BOOT_URL', 'http://localhost:8080');
    const loaiHocLieu = library.includes('QuestionSet') || library.includes('DragQuestion')
      ? 'BAI_TAP_H5P'
      : 'BAI_GIANG_H5P';

    try {
      await axios.post(
        `${springBootUrl}/api/v1/internal/hoc-lieu`,
        {
          h5pContentId: contentId,
          tieuDe: metadata?.title ?? 'Học liệu H5P không tên',
          loaiHocLieu,
          nguonGoc: 'GIAO_VIEN_TAO',
          giaoVienId: Number(teacherId) || null,
        },
        {
          // Chung secret với JWT bên Spring Boot để xác thực service-to-service.
          headers: { 'X-Internal-Secret': this.configService.get('JWT_SECRET') },
        },
      );
      this.logger.log(`Đã thông báo Spring Boot: contentId=${contentId}`);
    } catch (error) {
      this.logger.warn(`Không thể thông báo Spring Boot (sẽ retry sau): ${error.message}`);
    }
  }
}
