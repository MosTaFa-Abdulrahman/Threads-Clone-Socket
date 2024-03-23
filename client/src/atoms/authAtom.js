import { atom } from "recoil";

const authPageAtom = atom({
  key: "authPageAtom",
  default: "login",
});

export default authPageAtom;
