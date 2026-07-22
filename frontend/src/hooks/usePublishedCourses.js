import { useEffect, useState } from "react";
import api from "../services/api";

const usePublishedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/course/published");
        if (!cancelled) setCourses(data.courses);
      } catch {
        if (!cancelled) setError("Không thể tải danh sách khóa học");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, []);

  return { courses, error, loading };
};

export default usePublishedCourses;
