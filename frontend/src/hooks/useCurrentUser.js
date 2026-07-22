import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/userSlice";
import api from "../services/api";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/current-user");
        if (data.success) dispatch(setUser(data.user));
        else dispatch(clearUser());
      } catch {
        dispatch(clearUser());
      } finally {
        setIsChecking(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return isChecking;
};

export default useCurrentUser;
