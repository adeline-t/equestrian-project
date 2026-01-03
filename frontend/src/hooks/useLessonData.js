import { useState, useEffect } from 'react';
import { lessonsApi } from '../services/calendarApi';

/**
 * Custom hook for managing lesson data
 * @param {number} lessonId - Lesson ID
 * @returns {Object} Lesson data, loading state, error, and refresh function
 */
export const useLessonData = (lessonId) => {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLessonDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lessonsApi.getById(lessonId);
      setLessonData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId) {
      loadLessonDetails();
    }
  }, [lessonId]);

  return {
    lessonData,
    loading,
    error,
    refresh: loadLessonDetails,
  };
};