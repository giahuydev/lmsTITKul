# TITKUL LMS — Tài liệu Tổng quan Dự án
> **Phiên bản:** v3 | **Cập nhật:** 18/06/2026 | **Deadline bảo vệ:** 16/08/2026

---

## MỤC LỤC
1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Tech Stack & Kiến trúc](#2-tech-stack--kiến-trúc)
3. [UI/UX](#3-uiux)
4. [Nghiệp vụ chi tiết 14 quy trình](#4-nghiệp-vụ-chi-tiết-14-quy-trình)
5. [Cơ sở dữ liệu](#5-cơ-sở-dữ-liệu)
6. [Kế hoạch 12 tuần](#6-kế-hoạch-12-tuần)
7. [Phân công module](#7-phân-công-module)

---

## 1. GIỚI THIỆU DỰ ÁN

**Tên:** Website Hỗ Trợ Học Tập (LMS) — Titkul Kids
**Đơn vị:** Công ty Titkul | **Loại:** Luận văn tốt nghiệp
**Nhóm:** 2 thành viên Fullstack | **Deadline:** 16/08/2026

Hệ thống LMS dành riêng cho học sinh tiểu học Việt Nam, bám theo **bộ sách Kết nối tri thức**. 4 vai trò: Admin · Giáo viên · Học sinh · Phụ huynh.

### Ba điểm sáng tạo cốt lõi
1. **H5P tương tác** — GV tạo bài giảng + bài tập (kéo thả, ghép hình, điền từ, nối cột) ngay trong hệ thống qua NestJS
2. **Gamified Quiz** — Quiz animation đúng/sai, điểm thưởng XP
3. **3 AI Features** (Gemma2) — AI gợi ý, GV quyết định

---

## 2. TECH STACK & KIẾN TRÚC

| Thành phần | Công nghệ |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend chính | Spring Boot (Java) — nghiệp vụ, điểm số, AI, thông báo |
| Backend H5P | NestJS + @lumieducation/h5p-server |
| Database | MySQL 8.0+ — 25 bảng (dùng chung 2 backend) |
| H5P Storage | Supabase Storage (content files) |
| AI | Gemma2 |

### Sơ đồ kiến trúc
```
React
    │
    ├─── REST API ──────► Spring Boot ──► MySQL
    │                          │
    │                          └── Gemma2
    │
    └─── H5P API ──────► NestJS ─────────► MySQL (bảng h5p_*)
                               │
                               └── Supabase Storage
```

### Phân vai Spring Boot vs NestJS
| Chức năng | Spring Boot | NestJS |
|---|---|---|
| Xác thực JWT | Cấp JWT (HS256 Shared Secret) | Verify JWT |
| H5P Editor | ✗ | ✅ Chạy Editor, lưu Supabase |
| H5P Player | ✗ | ✅ Serve content cho React |
| Lưu học liệu | ✅ Nhận từ NestJS → ghi `hoc_lieu` | Gọi Spring Boot sau khi GV lưu |
| Kết quả làm bài | ✅ React POST thẳng → `bai_nop` | ✗ |
| AI Features | ✅ Gọi API Gemma2 | ✗ |
| Điểm số, thông báo, huy hiệu | ✅ Toàn bộ | ✗ |

> **Quan trọng:** React bắt xAPI event từ H5P → POST **thẳng về Spring Boot**, không qua NestJS.

---

## 3. UI/UX

| Đối tượng | Style | Font | Màu chủ đạo |
|---|---|---|---|
| **Học sinh** | Duolingo-inspired, Mascot rùa 🐢 chibi, chunky 3D | Baloo 2 + Nunito | Xanh `#4B9EFF` + Tím `#818CF8` |
| **Giáo viên / Admin** | Professional SaaS (Notion/Linear) | Be Vietnam Pro | Neutral |
| **Phụ huynh** | Clean, đơn giản | Be Vietnam Pro | Neutral |

- **Icon:** Cute Color style (Icons8)
- **Animation:** Lottie (confetti, đúng/sai), số đếm lên, float
- **Hồng `#F472B6`** chỉ dùng làm accent

---

## 4. NGHIỆP VỤ CHI TIẾT 14 QUY TRÌNH

---

### QT01 — Quản lý danh tính
*Admin, Giáo viên, Học sinh, Phụ huynh*

#### 1.1. Đăng nhập
- **Đầu vào:** Tên đăng nhập (Email / SĐT / Mã định danh) + Mật khẩu
- **Xử lý:** Kiểm tra tài khoản hợp lệ. Nếu LOCKED / DISABLED → từ chối + báo lỗi
- **Đầu ra:** Cấp quyền theo vai trò → điều hướng về dashboard tương ứng
- **Bảng liên quan:** `nguoi_dung` (vai_tro, trang_thai), `ho_so_*`

#### 1.2. Đổi mật khẩu
- **Điều kiện:** Đã đăng nhập
- **Bước 1:** Nhập MK cũ, MK mới, Xác nhận MK mới
- **Bước 2:** FE kiểm tra MK mới = Xác nhận. BE đối chiếu MK cũ → sai thì báo lỗi, dừng
- **Bước 3:** MK cũ đúng → sinh OTP ngẫu nhiên (hiệu lực 1 phút) → gửi Email đã đăng ký. MK mới giữ tạm trên FE, chưa lưu DB
- **Bước 4:** Nhập OTP. Sai/quá hạn → báo lỗi, yêu cầu gửi lại. Đúng → hash MK mới → lưu DB
- **Bước 5:** Thông báo thành công → đăng xuất tất cả phiên khác
- **Bảng liên quan:** `nguoi_dung` (mat_khau_hash), `phien_xac_thuc` (ma_otp, het_han, da_su_dung)

#### 1.3. Quên mật khẩu
**Luồng 1 — Chủ động** (tài khoản có Email/SĐT):
- Bước 1: Nhập Email hoặc SĐT
- Bước 2: Hệ thống gửi OTP hoặc Link xác thực có thời hạn
- Bước 3: Xác thực đúng → hiện form nhập MK mới → lưu

**Luồng 2 — Thụ động** (Học sinh không có liên lạc riêng):
- **Ưu tiên 1 — Phụ huynh cấp lại:** PH đăng nhập → "Quản lý tài khoản con" → "Cấp lại mật khẩu" → đặt MK mới. HS bị ép đổi MK lần đăng nhập tiếp
- **Ưu tiên 2 — Qua Admin:** HS báo GV → GV tạo Phiếu hỗ trợ ("Gửi yêu cầu Reset") → Admin duyệt → hệ thống reset MK về mặc định, bật `bat_buoc_doi_mk = 1`. **GV không có quyền đổi MK trực tiếp**
- **Bảng liên quan:** `phieu_ho_tro` (trang_thai: CHO_DUYET/DA_DUYET), trigger `trg_duyet_phieu_reset_mk`

#### 1.4. Chọn con (Phụ huynh)
- **Bước 1:** PH đăng nhập → hệ thống đếm số con liên kết
- **Bước 2:** 1 con → vào thẳng Dashboard. ≥2 con → màn hình "Chọn hồ sơ" (thẻ: Tên + Lớp)
- **Bước 3:** Click chọn hồ sơ → ghi nhận ngữ cảnh làm việc → toàn bộ data lọc theo con này
- **Bước 4:** Nút "Đổi hồ sơ" luôn hiện trên header
- **Bảng liên quan:** `phu_huynh_hoc_sinh` (N-N), `ho_so_hoc_sinh`

---

### QT02 — Quản trị nền tảng
*Admin*

#### 2.1. Cấu hình thông tin trường học
- **Đầu vào:** Tên trường, Logo, Địa chỉ, Hotline, Email, Năm học hiện tại, Học kỳ hiện tại
- **Xử lý:** Thay đổi mang tính toàn cục. Khi đổi Năm học/Học kỳ → tự động cập nhật bộ lọc mặc định của toàn hệ thống (sổ điểm, báo cáo, dashboard)
- **Đầu ra:** Logo/thông tin chân trang/kỳ học mặc định cập nhật tức thì toàn hệ thống
- **Bảng liên quan:** `cau_hinh_he_thong` (singleton, ID = 1)

#### 2.2. Phân quyền RBAC
- **Đầu vào:** Ma trận 4 vai trò × toàn bộ tính năng (quyền Xem/Thêm/Sửa/Xóa)
- **Xử lý:** 4 vai trò gốc khóa cứng, không xóa được. Khi tắt quyền → ẩn nút ngay trên UI. Nếu cố thực hiện → chặn + báo lỗi "Không có quyền"
- **Đầu ra:** Phân quyền lưu thành công, áp dụng tức thì toàn bộ người dùng
- **Xử lý ở tầng:** Spring Security (không có bảng RBAC riêng — xử lý qua `vai_tro` trong `nguoi_dung`)

#### 2.3. Dashboard tổng quan toàn trường
- **Đầu vào:** Bộ lọc thời gian (mặc định theo Năm học/Học kỳ hiện tại, lọc thêm theo tháng/tuần/khối)
- **Xử lý:** Tính toán 3 mảng:
  - Chỉ số nhân sự: số GV/HS/PH Active vs Locked
  - Chỉ số nội dung: số lớp mở, tài liệu tải lên, bài giảng/bài tập tạo
  - Chỉ số tương tác: lưu lượng đăng nhập, tỷ lệ bài tập đã chấm, tỷ lệ nộp bài
- **Drill-down:** Click vào con số → điều hướng đến danh sách chi tiết
- **Đầu ra:** KPI cards + biểu đồ tròn/cột + danh sách cảnh báo
- **Query real-time** từ các bảng, không lưu bảng riêng

---

### QT03 — Quản lý tài khoản
*Admin*

#### 3.1. Quản lý tài khoản giáo viên
- **Tạo mới:** Auto-sinh Username (GV + SĐT), MK mặc định. SĐT + Email là UNIQUE
- **Vô hiệu hóa:** Không xóa cứng — tài khoản mất quyền đăng nhập nhưng lịch sử bài giảng, nhận xét, điểm số vẫn giữ nguyên
- **Bảng:** `nguoi_dung` (trang_thai: ACTIVE/LOCKED/DISABLED), `ho_so_giao_vien`

#### 3.2. Quản lý tài khoản học sinh
- **Ràng buộc:** Bắt buộc gắn vào lớp đang ACTIVE. Auto-sinh Username (HS + Mã HS), MK mặc định
- **Không cho sửa `ma_hoc_sinh`** sau khi tạo → trigger `trg_lock_ma_hoc_sinh`
- **Bảng:** `ho_so_hoc_sinh`, trigger BEFORE UPDATE

#### 3.3. Import Excel HS + PH
- **Quy tắc All-or-Nothing:** Quét toàn bộ file trước. Có lỗi bất kỳ → từ chối toàn file, bôi đỏ dòng lỗi, yêu cầu tải lại
- **Nếu hợp lệ 100%:** Tạo tài khoản HS → kiểm tra SĐT PH (nếu chưa có → tạo mới, nếu đã có → skip) → thiết lập liên kết PH-HS
- **Đầu ra:** Bảng tổng kết (VD: "40 HS mới, 38 PH mới, 2 PH liên kết thêm con")
- **Bảng:** `lo_import`, `ho_so_hoc_sinh`, `ho_so_phu_huynh`, `phu_huynh_hoc_sinh`

---

### QT04 — Quản lý lớp học
*Admin*

#### 4.1. Tạo / Sửa / Vô hiệu hóa lớp học
- **Ràng buộc:** Tên lớp UNIQUE trong cùng khối + năm học
- **Đổi GVCN:** Tự động cắt quyền GV cũ, cấp quyền GV mới
- **Vô hiệu hóa:** Chuyển sang DONG_BANG (Read-only) — không giao bài/chấm điểm mới, lịch sử bảo toàn
- **Bảng:** `lop_hoc` (trang_thai: ACTIVE/DONG_BANG)

#### 4.2. Phân bổ học sinh qua Excel (Luồng chính)
- Tích hợp chung với QT03.3 — file Excel có cột "Mã lớp đích"
- Sau khi tạo tài khoản HS → tự động Batch Insert gán lớp theo cột Mã lớp
- Điều kiện: Các lớp đích phải được tạo sẵn trước khi import

#### 4.3. Chuyển lớp thủ công (Luồng ngoại lệ)
- Dùng cho biến động giữa năm (HS mới chuyển đến, xin đổi lớp)
- **Ràng buộc:** 1 HS chỉ thuộc 1 lớp tại 1 thời điểm
- **Khi chuyển:** Cảnh báo xác nhận → ngắt Lớp A → gán Lớp B. Bài tập chưa làm ở Lớp A bị hủy, điểm đã chốt bảo lưu
- **Bảng:** `ho_so_hoc_sinh` (lop_hoc_id), `lich_su_chuyen_lop`

---

### QT05 — Quản lý học liệu
*Giáo viên, Học sinh*

#### 5.1. Khai thác thư viện gốc
- Cây thư mục phân tầng: Bộ sách → Khối lớp → Môn học → Bài học
- GV và HS đều xem/tải được tài liệu seed theo Kết nối tri thức
- **Bảng:** `danh_muc_bai_hoc` (seed sẵn), `hoc_lieu` (nguon_goc: THU_VIEN_GOC)

#### 5.2. GV tạo tài liệu cá nhân
- GV soạn nội dung trên H5P Editor (qua NestJS) hoặc upload file (PDF, Word, ảnh)
- Bắt buộc gắn nhãn: môn học, bài học, khối lớp sau khi hoàn thành
- Lưu vào "Kho cá nhân" → HS chưa thấy ở bước này
- **Luồng lưu:** GV lưu trên NestJS → NestJS gọi Spring Boot `POST /api/internal/hoc-lieu` → Spring Boot ghi vào `hoc_lieu`
- **Bảng:** `hoc_lieu` (nguon_goc: GIAO_VIEN_TAO, loai: TAI_LIEU/BAI_GIANG_H5P/BAI_TAP_H5P)

#### 5.3. GV phân phối học liệu cho lớp
- GV chọn học liệu từ kho cá nhân → chỉ định lớp đích
- GV chỉ được chia sẻ cho lớp mình phụ trách
- Khi chia sẻ → cấp quyền truy cập, học liệu hiện trên thư viện lớp đó
- **Bảng:** `phan_phoi_hoc_lieu` (UNIQUE: hoc_lieu_id + lop_hoc_id)

#### 5.4. HS tiếp nhận học liệu
- HS vào "Lớp học của tôi" → hệ thống đối chiếu ID HS với ID lớp
- Hiển thị danh sách học liệu GV đã chia sẻ
- HS click → tương tác trực tiếp trên trình duyệt (H5P Player qua NestJS)
- **Bảng:** `phan_phoi_hoc_lieu`, `tien_do_hoc_sinh`

---

### QT06 — Xây dựng nội dung
*Giáo viên*

#### 6.1. Soạn bài giảng H5P
- GV khởi tạo "Bài giảng mới" → H5P Editor (NestJS) mở trong trình duyệt
- Dùng Interactive Video / Course Presentation / Branching Scenario
- **Điểm khác biệt:** Chèn điểm dừng câu hỏi (pop-up) ngay giữa video/slide → HS phải trả lời mới xem tiếp
- Lưu → NestJS đóng gói, lưu Supabase → gọi Spring Boot ghi `hoc_lieu`
- **Bảng:** `hoc_lieu` (loai: BAI_GIANG_H5P, noi_dung_h5p: JSON config)

#### 6.2. Thiết kế bài tập H5P
- Chọn template: Kéo thả (Drag and Drop), Ghép thẻ (Memory Game), Điền từ (Fill in the Blanks), Nối cột
- Thiết lập quy tắc chấm: trừ điểm sai, số lần làm lại tối đa, có nút gợi ý không
- H5P tự chấm điểm ngay khi HS hoàn thành
- **Bảng:** `hoc_lieu` (loai: BAI_TAP_H5P, cau_hinh_bai_tap: JSON, xp_thuong)

#### 6.3. Panel AI gợi ý bài tập bổ sung
- Panel AI hiện bên cạnh màn hình soạn thảo
- AI đọc nội dung chủ đề GV đang gõ → tự sinh danh sách câu hỏi/bài tập bổ sung
- GV preview, chỉnh sửa → bấm "Thêm vào bài" → hệ thống tự chuyển thành khối H5P và chèn vào bài đang soạn
- **Bảng:** `goi_y_ai_nhan_xet` (trang_thai: NHAP/DA_CHON/BI_BO_QUA)

---

### QT07 — Giao nhiệm vụ
*Giáo viên*

#### 7.1. Giao bài và thiết lập deadline
- **Đầu vào:** Chọn bài tập (H5P hoặc tự luận) → chọn lớp (toàn bộ hoặc nhóm HS cụ thể) → đặt thời gian bắt đầu + deadline
- **Quy tắc nộp trễ (2 chế độ):**
  - **Soft Lock:** Cho nộp sau deadline nhưng tự động gắn cờ "Nộp trễ" màu đỏ + ghi số phút/giờ trễ
  - **Hard Lock:** Đúng deadline → nút "Nộp bài" bị vô hiệu hóa hoàn toàn
- **Sau khi GV bấm "Xác nhận giao bài":** Hệ thống phát Push Notification đến dashboard HS và PH
- **Đầu ra:** Bài tập xuất hiện trong "Bài cần làm" của HS, trạng thái: DANG_MO
- **Bảng:** `bai_tap` (trang_thai, thoi_diem_bat_dau, deadline, cho_nop_lai), `thong_bao`

---

### QT08 — Thực hành học tập
*Học sinh*

#### 8.1. Xem bài giảng H5P (Không gian sơ đồ học liệu)
Giao diện: Sơ đồ cây cố định theo bộ sách Kết nối tri thức. Bài giảng hiện trong Ngăn kéo (Drawer) khi click Node bài học.

**Quy tắc tương tác cốt lõi:**
- Ghi nhận tiến độ 0–100% tự động
- Chặn tua nhanh (Fast-forward) với nội dung chưa xem
- Điểm dừng câu hỏi (Stop-points): HS bắt buộc trả lời mới xem tiếp

**Ba luồng điều hướng cưỡng chế:**

**Luồng A — Học tuần tự (Tuyến tính):**
- HS học theo tốc độ cá nhân
- Phải hoàn thành 100% bài trước mới mở khóa bài sau

**Luồng B — HS học nhanh hơn lớp** (VD: HS học đến Bài 10, GV dạy Bài 4):
- GV bật "Ghim bài học bắt buộc" tại Bài 4
- Hệ thống: khóa Bài 5-10 (grey-out), auto-scroll về Bài 4, mở Drawer bài giảng GV
- HS xem xong Bài 4 → gỡ khóa Bài 5 trở đi + hiện nút "Quay lại Bài 10"

**Luồng C — HS học chậm hơn lớp** (VD: HS đang ở Bài 2, GV dạy Bài 4):
- GV bật "Ghim bài học bắt buộc" tại Bài 4
- Hệ thống: Bài 4 sáng lên cho phép click thẳng (lối đi tắt), Bài 3 vẫn khóa
- HS học Bài 4 xong → hệ thống auto-scroll về Bài 2 → HS tiếp tục Bài 2, Bài 3
- Khi hoàn thành Bài 3: hệ thống thấy Bài 4 đã học → tự động nhảy qua, mở Bài 5

**Bảng:** `tien_do_hoc_sinh` (phan_tram_hoan_thanh, da_hoan_thanh)

#### 8.2. Làm bài tập H5P (Danh sách bài tập độc lập)
- **Bước 1:** Truy cập "Danh sách bài tập" → hiện tên, bài học thuộc, trạng thái, đồng hồ đếm ngược deadline. Sắp xếp: sát hạn nhất lên đầu
- **Bước 2:** Bấm "Làm bài" → bộ đếm thời gian kích hoạt (nếu GV có cấu hình). HS thao tác kéo thả/nối cột/điền từ. H5P chấm điểm real-time
- **Bước 3 — Retry & Deadline Policy:**
  - Còn lượt làm lại → cho chọn "Làm lại"
  - Quá hạn Hard Lock → vô hiệu nút nộp, bài tự đóng
  - Quá hạn Soft Lock → nộp được nhưng gắn cờ "Nộp trễ"
- **Bước 4:** Điểm chốt (cao nhất hoặc lần cuối tùy cấu hình GV) → lưu vào sổ điểm. Bài chuyển trạng thái "Đã nộp"
- **Luồng lưu kết quả:** React bắt xAPI event → `POST /api/bai-nop` Spring Boot → trigger cộng XP
- **Bảng:** `bai_nop` (diem_h5p, xp_nhan_duoc, trang_thai), trigger `trg_cong_xp_khi_nop_bai`

#### 8.3. Làm Gamified Quiz
- Đây là giao diện FE (animation + XP), **không phải bảng DB riêng**
- Quiz chọn từ danh sách bài tập H5P → FE render dạng Quiz có animation
- Khi HS trả lời đúng: animation chúc mừng + hiện XP cộng
- Khi sai: phản hồi nhẹ nhàng (không phạt nặng về tâm lý)
- Sau khi xong: hiện tổng điểm, tỷ lệ đúng, so sánh lần trước
- **Lưu kết quả:** Tương tự 8.2 — POST về Spring Boot → lưu vào `bai_nop`

---

### QT09 — Thu thập bài nộp
*Học sinh, Phụ huynh*

#### 9.1. Nộp bài tự luận
- **Đầu vào:** Văn bản Rich Text hoặc file đính kèm (ảnh, PDF, Word)
- **Chế độ Lưu nháp (Save Draft):** GV không thấy, HS giữ quyền chỉnh sửa/xóa
- **Chế độ Nộp chính thức (Submit):** Đối chiếu với deadline:
  - Trong hạn → khóa chỉnh sửa, trạng thái: DA_NOP
  - Quá hạn + Soft Lock → tiếp nhận nhưng gắn cờ NOP_TRE
  - Quá hạn + Hard Lock → vô hiệu nút nộp
- **Đầu ra:** Bài nộp vào danh sách chờ chấm của GV. Trạng thái cập nhật cho cả HS và PH
- **Bảng:** `bai_nop` (trang_thai: CHUA_NOP/DA_NOP/NOP_TRE/YC_LAM_LAI/DA_CHAM)

#### 9.2. Học sinh xem trạng thái bài nộp
Vòng đời trạng thái + màu sắc:
- **Xám** — Chưa nộp: chưa tương tác
- **Cam** — Lưu nháp: đã lưu phía HS, chưa gửi
- **Xanh dương** — Đã nộp / Nộp trễ: đang chờ GV chấm
- **Đỏ nhấp nháy** — Yêu cầu làm lại: GV trả bài, mở khóa nút nộp để nộp lại
- **Xanh lá** — Đã chấm: click xem điểm + nhận xét

#### 9.3. Phụ huynh xem bài tập sắp đến hạn
- Bộ lọc kép: (Chưa nộp / Lưu nháp / YC làm lại) **VÀ** (deadline còn < 48 giờ hoặc đã quá hạn Soft Lock)
- Hiển thị danh sách "Bài tập sắp đến hạn / Chưa nộp" trên trang chủ PH
- Sắp xếp: sát nút nhất lên đầu, kèm đồng hồ đếm ngược

---

### QT10 — Chấm bài
*Giáo viên*

#### 10.1. Xem danh sách bài nộp
- Chọn bài tập → bộ lọc trạng thái (Tất cả / Chờ chấm / Đã chấm / YC làm lại / Nộp trễ)
- **Chỉ hiển thị bài "Đã nộp"** — tuyệt đối không hiển thị bài Lưu nháp
- Bài Nộp trễ và Nộp lại gắn nhãn nổi bật để GV ưu tiên
- Sắp xếp mặc định: thời gian nộp cũ → mới (ai nộp trước chấm trước)

#### 10.2. Chấm điểm + nhận xét định tính
- **Đầu vào:** Điểm số (0–10) + Nhận xét định tính + Hành động
- **Hành động 1 — Lưu & Duyệt:**
  - Kiểm tra điểm hợp lệ → trạng thái bài: DA_CHAM → điểm đẩy sang sổ điểm
  - Trigger: gửi thông báo kết quả đến HS và PH
- **Hành động 2 — Yêu cầu làm lại:**
  - GV nhập lý do → trạng thái bài: YC_LAM_LAI → mở khóa nút nộp của HS
- **Bảng:** `danh_gia_bai_lam`, trigger `trg_cap_nhat_trang_thai_bai_nop`

#### 10.3. Gợi ý nhận xét tự động (AI)
- GV bấm "Gợi ý nhận xét bằng AI"
- Hệ thống thu thập: điểm số vừa nhập + nội dung file tự luận + lịch sử học tập gần đây của HS
- AI sinh 2–3 phương án nhận xét (văn phong sư phạm, động viên xây dựng)
- **Human-in-the-loop bắt buộc:** AI không tự lưu. GV chọn 1 phương án, chỉnh sửa theo ý → bấm Lưu mới ghi vào DB
- **Bảng:** `goi_y_ai_nhan_xet` (trang_thai: NHAP → DA_CHON hoặc BI_BO_QUA)

---

### QT11 — Phân phối kết quả
*Giáo viên, Học sinh, Phụ huynh*

#### 11.1. Xuất sổ điểm PDF / Excel
- **Đầu vào:** Chọn lớp + học kỳ/năm học + định dạng (Excel / PDF)
- **Xử lý:**
  - Chỉ lấy bài đã ở trạng thái DA_CHAM, để trống (null) bài chưa chấm
  - Tính GPA theo trọng số (VD: chuyên cần ×1, định kỳ ×2, cuối kỳ ×3)
  - Excel: nhúng Formula tính điểm TB (không chỉ xuất giá trị tĩnh)
  - PDF: biểu mẫu chuẩn sư phạm + khóa chỉnh sửa (Read-only) cho tính pháp lý
- **Bảng:** Query từ `danh_gia_bai_lam`, `bai_nop`, `ho_so_hoc_sinh`

#### 11.2. Học sinh xem điểm + nhận xét
- Chỉ hiển thị điểm của chính HS đang đăng nhập (không thấy điểm bạn khác)
- Click vào điểm → hiện: tên bài, điểm, nhận xét định tính GV + lời khuyên AI đã duyệt

#### 11.3. Phụ huynh xem điểm + nhận xét con
- Push Alert ngay khi GV bấm Lưu & Duyệt (VD: "Bé A vừa có điểm Toán: 9/10")
- Lọc tự động theo con đang chọn ngữ cảnh
- Xuất "Phiếu điểm rút gọn" PDF để PH lưu trữ riêng

---

### QT12 — Khen thưởng
*Giáo viên, Học sinh, Phụ huynh*

#### 12.1. GV gửi thư khen / huy hiệu thủ công
- Chọn HS (1 hoặc nhóm) → chọn loại huy hiệu → nhập nội dung thư khen (tùy chọn)
- Hệ thống cung cấp thư viện biểu tượng huy hiệu + template thư khen
- Bấm "Gửi thưởng" → đóng dấu GV + timestamp → ghi vào Hồ sơ khen thưởng HS
- Auto Push Notification đến HS và email PH
- **Bảng:** `khen_thuong_hoc_sinh` (nguon_cap: THU_CONG), `huy_hieu`

#### 12.2. Hệ thống tự động cấp huy hiệu (Rule-based)
Hệ thống liên tục quét dữ liệu học tập đối chiếu với các mốc thành tích:
- **"Kiện tướng Đúng hạn":** Nộp liên tiếp 5 bài trước deadline
- **"Nhà thông thái":** Đạt điểm 10 trong 3 bài liên tiếp
- **"Chuyên cần":** Hoàn thành 100% bài giảng đúng lộ trình trong 1 tháng
- **"Vượt khó thành công":** Hoàn thành lấp lỗ hổng kiến thức (Luồng C) trong 48 giờ

Khi đạt điều kiện → tự động mở khóa huy hiệu + hiện Pop-up animation chúc mừng lần đăng nhập tiếp
- **Bảng:** `khen_thuong_hoc_sinh` (nguon_cap: HE_THONG), `huy_hieu` (dieu_kien: JSON)

#### 12.3. HS xem bộ sưu tập huy hiệu
- **Tab Bộ sưu tập:** Huy hiệu đạt được → sáng màu + ngày nhận. Chưa đạt → xám mờ + mô tả điều kiện ("Bạn cần nộp thêm 2 bài đúng hạn để mở khóa")
- **Tab Hộp thư khen:** Danh sách thư khen theo dòng thời gian, dạng thiệp

#### 12.4. PH nhận thông báo và xem thành tích con
- Push Notification tức thời khi con được khen (thủ công hoặc tự động)
- Nội dung thông báo cá nhân hóa: "Tin vui! Bé A vừa được cô gửi Thư khen vì tương trợ bạn bè..."
- Vào mục "Thành tích của con" → lọc theo con đang chọn ngữ cảnh

---

### QT13 — Truyền thông nội bộ
*Giáo viên, Học sinh, Phụ huynh*

#### 13.1. GV đăng thông báo
- GV chỉ đăng được cho lớp mình phụ trách
- **Ghim bài:** Thông báo quan trọng ghim lên đầu (lịch thi, dã ngoại...) cho đến khi GV gỡ
- Bấm "Xuất bản" → Push Notification tức thì đến toàn bộ HS và PH của lớp

#### 13.2. HS xem thông báo
- Chỉ thấy thông báo của lớp mình
- Chưa đọc: chấm đỏ/nền nổi bật. Click → đánh dấu "Đã đọc", badge giảm xuống

#### 13.3. PH xem thông báo
- Lọc tự động theo lớp của con đang chọn ngữ cảnh
- Trạng thái đọc độc lập với HS — con đọc rồi không ảnh hưởng badge của PH
- **Bảng:** `thong_bao`, `trang_thai_doc_thong_bao` (PK tổ hợp: nguoi_dung_id + thong_bao_id)

---

### QT14 — Báo cáo tiến độ
*Giáo viên, Học sinh*

#### 14.1. Dashboard AI tóm tắt lớp buổi sáng (AI-01)
- Vào đầu ngày, AI quét: tiến độ bài giảng H5P, lịch sử làm bài tập, thời gian học tập của cả lớp
- Cảnh báo bất thường: HS chưa xem bài giảng bắt buộc, câu hỏi tỷ lệ sai cao
- **Cache:** UNIQUE(giao_vien_id, lop_hoc_id, ngay_bao_cao) → chỉ gọi API 1 lần/ngày/GV
- **Đầu ra:** Đoạn văn ngắn trên trang chủ GV (VD: "Hôm qua 92% HS hoàn thành Bài 4. Cần lưu ý 3 em chưa xem...")
- **Bảng:** `bao_cao_ai_buoi_sang`, nguồn data: `tien_do_hoc_sinh`, `bai_nop`, `danh_gia_bai_lam`

#### 14.2. GV xem tiến độ từng học sinh
- Chọn HS → xem: % hoàn thành sơ đồ bài giảng, danh sách bài nộp đúng hạn/trễ/nợ
- Nhận diện HS đang học vượt tiến độ / đúng hạn / tụt lại
- **Bảng:** `tien_do_hoc_sinh`, `bai_nop`

#### 14.3. HS xem dashboard cá nhân
- HS đăng nhập → hệ thống quét real-time và tổng hợp 3 vùng:
  - **To-do list:** Bài cần làm kèm deadline (sắp hạn nhất lên đầu)
  - **Thông báo mới:** Từ GV chưa đọc
  - **Huy hiệu + XP:** Thành tích + thanh tiến trình level
- Giao diện cá nhân hóa hoàn toàn theo dữ liệu HS đó

---

## 5. CƠ SỞ DỮ LIỆU

**Hệ quản trị:** MySQL 8.0+ | **Encoding:** utf8mb4_unicode_ci
**Tổng:** 25 bảng nghiệp vụ | 4 Triggers | 11 Indexes
**Bảng H5P riêng biệt:** prefix `h5p_*` (không lẫn vào 25 bảng nghiệp vụ)

### Nguyên tắc thiết kế
- **No Hard Delete:** tài khoản chỉ vô hiệu hóa, lớp chỉ đóng băng
- **3NF:** Tách `danh_muc_bai_hoc` ra khỏi `hoc_lieu` để tránh dư thừa phân cấp sách
- **AI không tự lưu:** `goi_y_ai_nhan_xet` luôn ở NHAP, GV phải chủ động chọn
- **Cache AI:** UNIQUE(GV + lớp + ngày) trong `bao_cao_ai_buoi_sang`
- **XP qua trigger:** `trg_cong_xp_khi_nop_bai` chạy sau INSERT vào `bai_nop`

---

### Nhóm 1 — Người dùng & Xác thực

#### Bảng: `nguoi_dung`
*Tài khoản xác thực dùng chung 4 vai trò. Tách khỏi hồ sơ để tối ưu bảo mật.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| nguoi_dung_id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | Khóa chính |
| ten_dang_nhap | VARCHAR(100) | UNIQUE, NOT NULL | Email / SĐT / Mã định danh |
| mat_khau_hash | VARCHAR(255) | NOT NULL | Đã băm bcrypt/argon2 |
| vai_tro | ENUM | NOT NULL | ADMIN / GIAO_VIEN / HOC_SINH / PHU_HUYNH |
| trang_thai | ENUM | DEFAULT 'ACTIVE' | ACTIVE / LOCKED / DISABLED |
| email | VARCHAR(150) | UNIQUE | Email nhận OTP |
| so_dien_thoai | VARCHAR(15) | UNIQUE | SĐT — username mặc định PH/HS |
| bat_buoc_doi_mk | TINYINT(1) | DEFAULT 0 | Ép đổi MK lần đăng nhập tiếp |
| lan_dang_nhap_cuoi | DATETIME | NULL | Lần đăng nhập gần nhất |
| ngay_tao | DATETIME | DEFAULT NOW() | |
| ngay_cap_nhat | DATETIME | ON UPDATE NOW() | |

#### Bảng: `ho_so_giao_vien`
*1-1 với nguoi_dung. Khi GV nghỉ: vô hiệu hóa tài khoản, hồ sơ vẫn giữ.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| giao_vien_id | BIGINT UNSIGNED | PK | |
| nguoi_dung_id | BIGINT UNSIGNED | FK → nguoi_dung, UNIQUE | 1-1 |
| ho_ten | VARCHAR(100) | NOT NULL | |
| bo_mon | VARCHAR(100) | NULL | Bộ môn giảng dạy |
| ngay_sinh | DATE | NULL | |

#### Bảng: `ho_so_hoc_sinh`
*1-1 với nguoi_dung. `ma_hoc_sinh` khóa cứng bằng trigger.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| hoc_sinh_id | BIGINT UNSIGNED | PK | |
| nguoi_dung_id | BIGINT UNSIGNED | FK → nguoi_dung, UNIQUE | 1-1 |
| ma_hoc_sinh | VARCHAR(30) | UNIQUE, NOT NULL | Không được sửa sau tạo |
| ho_ten | VARCHAR(100) | NOT NULL | |
| ngay_sinh | DATE | NULL | |
| lop_hoc_id | BIGINT UNSIGNED | FK → lop_hoc, NULL | Lớp hiện tại |
| tong_xp | INT UNSIGNED | DEFAULT 0 | Tích lũy từ bài tập H5P/Quiz |

#### Bảng: `ho_so_phu_huynh`
*1-1 với nguoi_dung. Nhận diện trùng bằng SĐT.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| phu_huynh_id | BIGINT UNSIGNED | PK | |
| nguoi_dung_id | BIGINT UNSIGNED | FK → nguoi_dung, UNIQUE | 1-1 |
| ho_ten | VARCHAR(100) | NOT NULL | |
| email_nhan_thong_bao | VARCHAR(150) | NULL | Email nhận thông báo khen thưởng |

#### Bảng: `phu_huynh_hoc_sinh`
*N-N: 1 PH nhiều con, 1 HS nhiều người giám hộ. PK tổ hợp.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| phu_huynh_id | BIGINT UNSIGNED | PK/FK → ho_so_phu_huynh | |
| hoc_sinh_id | BIGINT UNSIGNED | PK/FK → ho_so_hoc_sinh | |
| quan_he | VARCHAR(30) | NULL | Cha / Mẹ / Người giám hộ |
| ngay_lien_ket | DATETIME | DEFAULT NOW() | |

---

### Nhóm 2 — Quản lý lớp & Hệ thống

#### Bảng: `lop_hoc`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| lop_hoc_id | BIGINT UNSIGNED | PK | |
| ten_lop | VARCHAR(20) | NOT NULL | UNIQUE(ten_lop, khoi_lop, nam_hoc) |
| khoi_lop | TINYINT UNSIGNED | CHECK(1..5) | |
| nam_hoc | VARCHAR(10) | NOT NULL | VD: 2025-2026 |
| giao_vien_chu_nhiem_id | BIGINT UNSIGNED | FK, ON DELETE SET NULL | |
| si_so_toi_da | TINYINT UNSIGNED | DEFAULT 40 | |
| trang_thai | ENUM | DEFAULT 'ACTIVE' | ACTIVE / DONG_BANG |

#### Bảng: `cau_hinh_he_thong`
*Singleton — chỉ 1 bản ghi (ID = 1).*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| cau_hinh_id | TINYINT UNSIGNED | PK, CHECK(=1) | Luôn = 1 |
| ten_truong | VARCHAR(200) | NOT NULL | |
| logo_url | VARCHAR(500) | NULL | |
| dia_chi | TEXT | NULL | |
| hotline | VARCHAR(20) | NULL | |
| email_lien_he | VARCHAR(150) | NULL | |
| nam_hoc_hien_tai | VARCHAR(10) | NOT NULL | Bộ lọc mặc định toàn hệ thống |
| hoc_ky_hien_tai | TINYINT UNSIGNED | CHECK(1..3) | |

#### Bảng: `lo_import`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| lo_id | BIGINT UNSIGNED | PK | |
| nguoi_thuc_hien_id | BIGINT UNSIGNED | FK → nguoi_dung | Admin thực hiện |
| loai_import | ENUM | NOT NULL | TAI_KHOAN / PHAN_LOP |
| ten_file | VARCHAR(255) | NOT NULL | |
| trang_thai | ENUM | DEFAULT 'DANG_XU_LY' | DANG_XU_LY / THANH_CONG / CO_LOI |
| so_thanh_cong | INT UNSIGNED | NULL | |
| chi_tiet_loi | JSON | NULL | Dòng lỗi + lý do |
| tom_tat_ket_qua | JSON | NULL | Số HS mới, PH mới, PH liên kết |
| thoi_diem_import | DATETIME | DEFAULT NOW() | |

---

### Nhóm 3 — Kho học liệu & H5P

#### Bảng: `danh_muc_bai_hoc`
*Seed theo bộ sách. Tách ra để đạt chuẩn 3NF — tránh lặp bo_sach/khoi_lop/mon_hoc trong hoc_lieu.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| bai_hoc_id | INT UNSIGNED | PK | |
| bo_sach | VARCHAR(100) | NOT NULL | VD: Kết nối tri thức |
| khoi_lop | TINYINT UNSIGNED | CHECK(1..5) | |
| mon_hoc | VARCHAR(100) | NOT NULL | Toán, Tiếng Việt, ... |
| ten_bai | VARCHAR(200) | NOT NULL | |
| so_bai | SMALLINT UNSIGNED | NULL | Số thứ tự bài |
| hoc_ky | TINYINT UNSIGNED | CHECK(1..2) | |
| | | UNIQUE(bo_sach, khoi_lop, mon_hoc, ten_bai) | |

#### Bảng: `hoc_lieu`
*Gộp tất cả loại: tài liệu, bài giảng H5P, bài tập H5P. Phân biệt bằng loai_hoc_lieu.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| hoc_lieu_id | BIGINT UNSIGNED | PK | |
| tieu_de | VARCHAR(300) | NOT NULL | |
| loai_hoc_lieu | ENUM | NOT NULL | TAI_LIEU / BAI_GIANG_H5P / BAI_TAP_H5P |
| nguon_goc | ENUM | NOT NULL | THU_VIEN_GOC / GIAO_VIEN_TAO |
| bai_hoc_id | INT UNSIGNED | FK → danh_muc_bai_hoc, NULL | NULL nếu GV tạo tự do |
| giao_vien_id | BIGINT UNSIGNED | FK → ho_so_giao_vien, NULL | NULL nếu thư viện gốc |
| file_url | VARCHAR(500) | NULL | URL file PDF/Word |
| noi_dung_h5p | JSON | NULL | Config H5P |
| xp_thuong | SMALLINT UNSIGNED | DEFAULT 0 | XP thưởng khi hoàn thành |
| cho_lam_lai | TINYINT(1) | DEFAULT 0 | |
| so_lan_lam_toi_da | TINYINT UNSIGNED | NULL | NULL = không giới hạn |
| ngay_tao | DATETIME | DEFAULT NOW() | |

#### Bảng: `phan_phoi_hoc_lieu`
*Cơ chế cấp quyền xem cho HS theo lớp.*

| Cột | Kiểu | Ràng buộc | Mô tNSIGNED | FK → hoc_lieu | |
| lop_hoc_id | BIGINT UNSIGNED | F|
| hoc_lieu_id | BIGINT UNSIGNED | FK → hoc_lieu | |
| lop_hoc_id | BIGINT UNSIGNED | FK → lop_hoc | |
| giao_vien_id | BIGINT UNSIGNED | FK → ho_so_giao_vien | |
| ngay_chia_se | DATETIME | DEFAULT NOW() | |
| | | UNIQUE(hoc_lieu_id, lop_hoc_id) | |

---

### Nhóm 4 — Bài tập & Chấm điểm

#### Bảng: `bai_tap`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| bai_tap_id | BIGINT UNSIGNED | PK | |
| giao_vien_id | BIGINT UNSIGNED | FK, ON DELETE RESTRICT | |
| lop_hoc_id | BIGINT UNSIGNED | FK, ON DELETE RESTRICT | |
| hoc_lieu_id | BIGINT UNSIGNED | FK, ON DELETE SET NULL, NULL | NULL nếu bài tự do |
| tieu_de | VARCHAR(300) | NOT NULL | |
| mo_ta | TEXT | NULL | |
| loai_bai_tap | ENUM | NOT NULL | TU_LUAN / H5P / TU_DO |
| thoi_diem_bat_dau | DATETIME | NULL | NULL = đăng ngay |
| deadline | DATETIME | NOT NULL | |
| cho_nop_lai | TINYINT(1) | DEFAULT 0 | |
| trang_thai | ENUM | DEFAULT 'CHO_DANG' | CHO_DANG / DANG_MO / DA_DONG |
| ngay_tao | DATETIME | DEFAULT NOW() | |

#### Bảng: `bai_nop`
*Lưu kết quả cả tự luận, H5P và Gamified Quiz (qua cột xp_nhan_duoc).*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| bai_nop_id | BIGINT UNSIGNED | PK | |
| bai_tap_id | BIGINT UNSIGNED | FK, ON DELETE RESTRICT | |
| hoc_sinh_id | BIGINT UNSIGNED | FK, ON DELETE RESTRICT | |
| noi_dung_text | TEXT | NULL | Bài tự luận nhập trực tiếp |
| file_dinh_kem | VARCHAR(500) | NULL | URL file upload |
| diem_h5p | DECIMAL(5,2) | NULL | Điểm tự động H5P/Quiz |
| xp_nhan_duoc | SMALLINT UNSIGNED | DEFAULT 0 | XP nhận được lần này |
| so_lan_lam | TINYINT UNSIGNED | DEFAULT 1 | |
| trang_thai | ENUM | DEFAULT 'CHUA_NOP' | CHUA_NOP/DA_NOP/NOP_TRE/YC_LAM_LAI/DA_CHAM |
| la_nop_tre | TINYINT(1) | DEFAULT 0 | |
| thoi_diem_nop | DATETIME | NULL | |
| | | UNIQUE(bai_tap_id, hoc_sinh_id, so_lan_lam) | |

#### Bảng: `danh_gia_bai_lam`
*1-1 với bai_nop. Trigger cập nhật trạng thái bai_nop khi INSERT.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| danh_gia_id | BIGINT UNSIGNED | PK | |
| bai_nop_id | BIGINT UNSIGNED | FK, UNIQUE | 1-1 với bai_nop |
| giao_vien_id | BIGINT UNSIGNED | FK | |
| diem_so | DECIMAL(4,1) | CHECK(0..10), NULL | NULL nếu chỉ xếp loại |
| xep_loai | ENUM | NULL | HOAN_THANH_TOT/HOAN_THANH/CHUA_HOAN_THANH |
| nhan_xet | TEXT | NULL | Nhận xét GV đã duyệt |
| hanh_dong | ENUM | DEFAULT 'DUYET' | DUYET / YC_LAM_LAI |
| thoi_diem_cham | DATETIME | DEFAULT NOW() | |

---

### Nhóm 5 — AI Features

#### Bảng: `goi_y_ai_nhan_xet`
*AI không tự lưu — luôn ở NHAP cho đến khi GV chọn.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| goi_y_id | BIGINT UNSIGNED | PK | |
| bai_nop_id | BIGINT UNSIGNED | FK → bai_nop | |
| du_lieu_dau_vao | JSON | NOT NULL | Điểm + lịch sử + chuẩn sách |
| ket_qua_goi_y | JSON | NULL | 2-3 câu gợi ý |
| trang_thai | ENUM | DEFAULT 'NHAP' | NHAP / DA_CHON / BI_BO_QUA |
| thoi_diem_goi | DATETIME | DEFAULT NOW() | |

#### Bảng: `bao_cao_ai_buoi_sang`
*Cache 1 ngày/GV/lớp — UNIQUE constraint tránh gọi API lặp.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| bao_cao_id | BIGINT UNSIGNED | PK | |
| giao_vien_id | BIGINT UNSIGNED | FK | |
| lop_hoc_id | BIGINT UNSIGNED | FK | |
| ngay_bao_cao | DATE | NOT NULL | UNIQUE(giao_vien_id, lop_hoc_id, ngay_bao_cao) |
| noi_dung_tom_tat | TEXT | NOT NULL | Văn bản ngôn ngữ tự nhiên |
| du_lieu_phan_tich | JSON | NULL | Dữ liệu đầu vào thô |
| thoi_diem_tao | DATETIME | DEFAULT NOW() | |

---

### Nhóm 6 — Gamification & Khen thưởng

#### Bảng: `huy_hieu`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| huy_hieu_id | INT UNSIGNED | PK | |
| ten_huy_hieu | VARCHAR(100) | UNIQUE, NOT NULL | |
| mo_ta | TEXT | NULL | |
| icon_url | VARCHAR(500) | NULL | |
| loai | ENUM | NOT NULL | THU_CONG / TU_DONG |
| dieu_kien | JSON | NULL | Rule-based condition (NULL nếu THU_CONG) |

#### Bảng: `khen_thuong_hoc_sinh`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| khen_thuong_id | BIGINT UNSIGNED | PK | |
| hoc_sinh_id | BIGINT UNSIGNED | FK | |
| huy_hieu_id | INT UNSIGNED | FK | |
| giao_vien_id | BIGINT UNSIGNED | FK, ON DELETE SET NULL, NULL | NULL nếu hệ thống tự động |
| thu_khen | TEXT | NULL | Nội dung thư khen |
| nguon_cap | ENUM | DEFAULT 'THU_CONG' | THU_CONG / HE_THONG |
| thoi_diem_trao | DATETIME | DEFAULT NOW() | |
| da_gui_email | TINYINT(1) | DEFAULT 0 | Đã gửi email PH chưa |

---

### Nhóm 7 — Thông báo & Tiến độ

#### Bảng: `thong_bao`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| thong_bao_id | BIGINT UNSIGNED | PK | |
| nguoi_gui_id | BIGINT UNSIGNED | FK → nguoi_dung | |
| lop_hoc_id | BIGINT UNSIGNED | FK, NULL | NULL = thông báo hệ thống |
| tieu_de | VARCHAR(300) | NOT NULL | |
| noi_dung | TEXT | NULL | |
| file_dinh_kem | VARCHAR(500) | NULL | |
| loai_thong_bao | ENUM | DEFAULT 'NOI_BO' | NOI_BO / KHEN_THUONG / HE_THONG |
| la_ghim | TINYINT(1) | DEFAULT 0 | |
| ngay_dang | DATETIME | DEFAULT NOW() | |

#### Bảng: `trang_thai_doc_thong_bao`
*Trạng thái đọc độc lập từng người — HS đọc không ảnh hưởng badge PH. PK tổ hợp.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| nguoi_dung_id | BIGINT UNSIGNED | PK/FK | |
| thong_bao_id | BIGINT UNSIGNED | PK/FK | |
| da_doc | TINYINT(1) | DEFAULT 0 | |
| thoi_diem_doc | DATETIME | NULL | |

#### Bảng: `tien_do_hoc_sinh`
*Đầu vào quan trọng nhất cho 3 AI features. UNIQUE(HS + học liệu).*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| tien_do_id | BIGINT UNSIGNED | PK | |
| hoc_sinh_id | BIGINT UNSIGNED | FK | |
| hoc_lieu_id | BIGINT UNSIGNED | FK | UNIQUE(hoc_sinh_id, hoc_lieu_id) |
| phan_tram_hoan_thanh | TINYINT UNSIGNED | CHECK(0..100) | |
| thoi_gian_hoc | INT UNSIGNED | DEFAULT 0 | Tổng giây đã học |
| lan_xem_cuoi | DATETIME | NULL | |
| da_hoan_thanh | TINYINT(1) | DEFAULT 0 | |

#### Bảng: `phien_xac_thuc`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| phien_id | BIGINT UNSIGNED | PK | |
| nguoi_dung_id | BIGINT UNSIGNED | FK | |
| loai_xac_thuc | ENUM | NOT NULL | DOI_MAT_KHAU / QUEN_MAT_KHAU |
| ma_otp | VARCHAR(10) | NULL | |
| het_han | DATETIME | NOT NULL | Tạo + 1 phút |
| da_su_dung | TINYINT(1) | DEFAULT 0 | Dùng 1 lần rồi vô hiệu |
| thoi_diem_tao | DATETIME | DEFAULT NOW() | |

---

### Nhóm 8 — Bổ sung nghiệp vụ

#### Bảng: `phieu_ho_tro`
*Luồng GV tạo ticket → Admin duyệt → trigger reset MK HS.*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| phieu_id | BIGINT UNSIGNED | PK | |
| giao_vien_tao_id | BIGINT UNSIGNED | FK | |
| hoc_sinh_lien_quan_id | BIGINT UNSIGNED | FK | |
| loai_yeu_cau | VARCHAR(100) | DEFAULT 'RESET_MAT_KHAU' | |
| mo_ta | TEXT | NULL | |
| admin_xu_ly_id | BIGINT UNSIGNED | FK, NULL | |
| trang_thai | ENUM | DEFAULT 'CHO_DUYET' | CHO_DUYET / DA_DUYET / TU_CHOI |
| ghi_chu_xu_ly | TEXT | NULL | |
| ngay_tao | DATETIME | DEFAULT NOW() | |
| ngay_xu_ly | DATETIME | NULL | |

#### Bảng: `lich_su_chuyen_lop`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| chuyen_lop_id | BIGINT UNSIGNED | PK | |
| hoc_sinh_id | BIGINT UNSIGNED | FK | |
| lop_cu_id | BIGINT UNSIGNED | FK, NULL | NULL = gán lớp lần đầu |
| lop_moi_id | BIGINT UNSIGNED | FK | |
| nam_hoc_cu | VARCHAR(10) | NULL | |
| nam_hoc_moi | VARCHAR(10) | NOT NULL | |
| ly_do | ENUM | NOT NULL | LEN_LOP/O_LAI/CHUYEN_TRUONG/DOI_LOP/NHAP_HOC_MOI |
| ghi_chu | TEXT | NULL | |
| nguoi_thuc_hien_id | BIGINT UNSIGNED | FK | Admin thực hiện |
| thoi_diem_chuyen | DATETIME | DEFAULT NOW() | |

#### Bảng: `ket_qua_cuoi_nam`
*Xét lên lớp theo TT27/2020. UNIQUE(HS + lớp + năm học).*

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| ket_qua_id | BIGINT UNSIGNED | PK | |
| hoc_sinh_id | BIGINT UNSIGNED | FK | |
| lop_hoc_id | BIGINT UNSIGNED | FK | |
| nam_hoc | VARCHAR(10) | NOT NULL | UNIQUE(hoc_sinh_id, lop_hoc_id, nam_hoc) |
| ket_qua_hoc_tap | ENUM | NOT NULL | HOAN_THANH_TOT/HOAN_THANH/CHUA_HOAN_THANH |
| ket_qua_ren_luyen | ENUM | NOT NULL | TOT/DAT/CAN_CO_GANG |
| quyet_dinh | ENUM | NOT NULL | LEN_LOP / O_LAI / CHUYEN_CUP |
| duoc_xet_dac_cach | TINYINT(1) | DEFAULT 0 | |
| ly_do_dac_cach | TEXT | NULL | |
| giao_vien_xet_id | BIGINT UNSIGNED | FK | GV chủ nhiệm ký xét |
| ngay_xet | DATE | NOT NULL | |
| ghi_chu | TEXT | NULL | |

---

### 4 Triggers

| Trigger | Bảng | Thời điểm | Chức năng |
|---|---|---|---|
| `trg_lock_ma_hoc_sinh` | `ho_so_hoc_sinh` | BEFORE UPDATE | Chặn thay đổi `ma_hoc_sinh` |
| `trg_cap_nhat_trang_thai_bai_nop` | `danh_gia_bai_lam` | AFTER INSERT | Cập nhật trạng thái `bai_nop` khi GV chấm |
| `trg_cong_xp_khi_nop_bai` | `bai_nop` | AFTER INSERT | Cộng XP vào `ho_so_hoc_sinh.tong_xp` |
| `trg_duyet_phieu_reset_mk` | `phieu_ho_tro` | AFTER UPDATE | Bật `bat_buoc_doi_mk = 1` khi Admin duyệt |

### 11 Indexes

```sql
idx_hoc_lieu_loai        ON hoc_lieu (loai_hoc_lieu, bai_hoc_id)
idx_hoc_lieu_giao_vien   ON hoc_lieu (giao_vien_id)
idx_bai_hoc_bo_sach      ON danh_muc_bai_hoc (bo_sach, khoi_lop, mon_hoc)
idx_bai_tap_lop          ON bai_tap (lop_hoc_id, trang_thai)
idx_bai_nop_trang_thai   ON bai_nop (bai_tap_id, trang_thai)
idx_bai_nop_hoc_sinh     ON bai_nop (hoc_sinh_id, thoi_diem_nop)
idx_khen_thuong_hs       ON khen_thuong_hoc_sinh (hoc_sinh_id, thoi_diem_trao)
idx_thong_bao_lop        ON thong_bao (lop_hoc_id, la_ghim, ngay_dang)
idx_tien_do_hs           ON tien_do_hoc_sinh (hoc_sinh_id, da_hoan_thanh)
idx_phan_phoi_lop        ON phan_phoi_hoc_lieu (lop_hoc_id)
idx_chuyen_lop_hs        ON lich_su_chuyen_lop (hoc_sinh_id, thoi_diem_chuyen)
```

---

## 6. KẾ HOẠCH 12 TUẦN

> 📍 **Hôm nay: 18/06/2026 — Tuần 4**

### Nguyên tắc
- Báo cáo viết **song song** với code từ tuần 1
- Tuần 12 là **buffer** — KHÔNG thêm tính năng mới
- Seed mock data từ tuần 3 (1 lớp 20 HS, 4 tuần lịch sử)
- React bắt xAPI → POST **thẳng Spring Boot** (không qua NestJS)
- Chậm milestone → cắt tính năng thứ yếu, không kéo lịch

---

### GIAI ĐOẠN 1 — NỀN TẢNG (Tuần 1–3) ✅

| Tuần | Người A | Người B | Báo cáo |
|---|---|---|---|
| **T1** 19–25/05 ✅ | ERD + Schema · Auth JWT BE+FE | Khởi tạo React · API+UI quản lý GV | Chương 1 |
| **T2** 26/05–01/06 ✅ | API+UI HS + lớp · Seed data | Import Excel · Cấu hình trường | Chương 2 |
| **T3** 02–08/06 ✅ | Thư viện tài liệu · Dashboard Admin · Seed 20 HS | API tiến độ · Dashboard GV/HS/PH | Chương 2 (tiếp) |

> **✔ M1** (08/06): Auth + Import + Thư viện + Dashboard 4 vai trò

---

### GIAI ĐOẠN 2 — CORE FEATURES + AI (Tuần 4–8)

| Tuần | Người A | Người B | Báo cáo |
|---|---|---|---|
| **T4** 09–15/06 📍 | Setup NestJS + H5P Server · JWT Shared Secret · Supabase · H5P Editor React | H5P Player React · API nhận hoc_lieu từ NestJS · CORS · Seed danh_muc_bai_hoc | Chương 3 |
| **T5** 16–22/06 | GV tạo bài tập H5P · xAPI → Spring Boot · Trigger XP | Giao bài + Nộp bài tự luận · UI GV/HS | Chương 3 (tiếp) |
| **T6** 23–29/06 | Gamified Quiz UI (animation + XP) · UI trạng thái bài · Tiến độ HS | Chấm điểm + Nhận xét + Sổ điểm | Chương 4 |
| **T7** 30/06–06/07 | AI-01 Dashboard buổi sáng · AI-02 Gợi ý nhận xét | AI-03 Gợi ý bài tập · Thông báo lớp | Chương 4 (tiếp) |
| **T8** 07–13/07 | Huy hiệu thủ công + tự động · Email PH | UI PH tổng hợp · Fix lỗi tích hợp | Chương 4 (tiếp) |

> **✔ M2** (29/06): H5P + Giao/Nộp/Chấm + Quiz
> **✔ M3** (13/07): 40 tính năng hoàn chỉnh

---

### GIAI ĐOẠN 3 — HOÀN THIỆN (Tuần 9–11)

| Tuần | Người A | Người B | Báo cáo |
|---|---|---|---|
| **T9** 14–20/07 | Fix bug · Tối ưu API · Kiểm thử bảo mật | UI polish · Manual testing | Chương 5 |
| **T10** 21–27/07 | Tối ưu UI/UX | Manual testing | Chương 6 + Phụ lục |
| **T11** 28/07–03/08 | Kiểm thử tổng thể · Review báo cáo B | Kiểm thử tổng thể · Review báo cáo A · Luyện thuyết trình | Hoàn thiện toàn bộ |

> **✔ M4** (27/07): Video demo dự án hoàn thiện
> **✔ M5** (03/08): Nộp báo cáo cho GVHD

---

### GIAI ĐOẠN 4 — BUFFER (Tuần 12)

| Tuần | Nội dung |
|---|---|
| **T12** 04–10/08 | Chỉ fix lỗi nghiêm trọng · Nộp báo cáo chính thức · Mock Q&A · Luyện thuyết trình |

> ⚠️ **KHÔNG THÊM TÍNH NĂNG MỚI**

### 🎯 16/08/2026 — BẢO VỆ LUẬN VĂN

---

## 7. PHÂN CÔNG MODULE

| Module | Người A | Người B |
|---|---|---|
| Auth JWT, đổi/quên MK | ✅ | |
| RBAC — Spring Security | ✅ | |
| Quản lý tài khoản GV | ✅ | |
| Quản lý tài khoản HS + lớp | ✅ | |
| Import Excel HS + PH | | ✅ |
| Cấu hình trường + PH | | ✅ |
| Dashboard Admin | ✅ | ✅ (GV/HS/PH) |
| Thư viện tài liệu theo sách | ✅ | |
| NestJS setup + H5P bài giảng | ✅ | |
| H5P bài tập tương tác | | ✅ |
| Giao bài + Nộp bài tự luận | ✅ | |
| Chấm điểm + Nhận xét + Sổ điểm | | ✅ |
| Gamified Quiz (animation + XP) | ✅ | |
| Huy hiệu + Email PH | | ✅ |
| AI-01: Dashboard buổi sáng | ✅ | |
| AI-02: Gợi ý nhận xét | ✅ | |
| AI-03: Gợi ý bài tập bổ sung | | ✅ |
| Thông báo lớp + PH | | ✅ |
| **Báo cáo** | Chương 1,2,3,6 + Phụ lục | Chương 2,3,4,5,6 |

---

*Cập nhật lần cuối: 18/06/2026 — Tuần 4 đang thực hiện*
n 4 đang thực hiện*
