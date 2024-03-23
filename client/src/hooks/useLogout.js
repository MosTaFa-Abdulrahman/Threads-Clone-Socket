import useShowToast from "./useShowToast";
import { makeRequest } from "../requestMethod";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";

function useLogout() {
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await makeRequest.post("auth/logout");
      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/");
      window.location.reload();
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    }
  };

  return { handleLogout };
}

export default useLogout;
