import { useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useLogin() {
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const login = async (inputs) => {
    if (!inputs.username || !inputs.password) {
      return showToast("Warning", "Please fill all the fields 😍", "warning");
    }

    setLoading(true);

    try {
      const res = await makeRequest.post("auth/login", inputs);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setUser(res.data);
      window.location.reload();
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export default useLogin;
