import { useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useRegister() {
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const register = async (inputs) => {
    if (!inputs.username || !inputs.name || !inputs.email || !inputs.password) {
      return showToast("Warning", "Please fill all the fields 😍", "warning");
    }

    try {
      const res = await makeRequest.post("auth/register", inputs);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setUser(res.data);
      window.location.reload();
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
}

export default useRegister;
