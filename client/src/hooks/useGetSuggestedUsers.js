import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useGetSuggestedUsers() {
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      setSuggestedUsers([]);

      try {
        const res = await makeRequest.get("/user/suggested/get");
        if (res.data) {
          setSuggestedUsers(res.data);
        } else
          return showToast("Error", `Suggested Users Not Found 😥`, "error");
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);

  return { loading, suggestedUsers };
}

export default useGetSuggestedUsers;
