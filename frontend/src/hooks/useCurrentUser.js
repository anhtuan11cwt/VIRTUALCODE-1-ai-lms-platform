import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/userSlice";
import api from "../services/api";

const useCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/current-user");
        if (data.success) dispatch(setUser(data.user));
        else dispatch(clearUser());
      } catch {
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useCurrentUser;
