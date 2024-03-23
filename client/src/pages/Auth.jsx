import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import { useRecoilValue } from "recoil";
import authPageAtom from "../atoms/authAtom";

function Auth() {
  const authPageState = useRecoilValue(authPageAtom);

  return <>{authPageState === "login" ? <Login /> : <Register />}</>;
}

export default Auth;
