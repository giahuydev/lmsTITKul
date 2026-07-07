import { useState, useEffect } from 'react';
import { teacherService } from '../../../services/teacher.service';

export function useReportsViewModel() {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');

  useEffect(() => {
    teacherService.getReports()
      .then(setReportData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const openRewardModal = (name: string) => {
    setSelectedStudentName(name);
    setShowRewardModal(true);
  };

  const openProgressModal = (name: string) => {
    setSelectedStudentName(name);
    setShowProgressModal(true);
  };

  return {
    students: reportData?.students ?? [],
    isLoading,
    selectedStudentName,
    showRewardModal, setShowRewardModal,
    showProgressModal, setShowProgressModal,
    openRewardModal,
    openProgressModal,
  };
}
