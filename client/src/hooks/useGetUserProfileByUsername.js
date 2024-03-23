import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useGetUserProfileByUsername() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const res = await makeRequest.get(`user/find/${username}`);
        if (!res.data) {
          return showToast("Error", "User Not Found 😥", "error");
        } else setUser(res.data);
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  return { isLoading, user };
}

export default useGetUserProfileByUsername;
