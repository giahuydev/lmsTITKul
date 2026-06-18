import { useState } from 'react';
import type { SubmissionInfo } from '../../../types';

export function useGradingSystem() {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(1);
  const [viewGradedDetails, setViewGradedDetails] = useState<SubmissionInfo | null>(null);

  const handleSelectStudent = (id: number) => {
    setSelectedStudentId(id);
  };

  const handleViewDetails = (submission: SubmissionInfo) => {
    setViewGradedDetails(submission);
  };

  const closeDetails = () => {
    setViewGradedDetails(null);
  };

  return {
    selectedStudentId,
    viewGradedDetails,
    handleSelectStudent,
    handleViewDetails,
    closeDetails
  };
}
