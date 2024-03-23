import { useEffect, useState } from "react";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";
import { useRecoilState } from "recoil";
import { conversationsAtom } from "../atoms/messageAtom";

function useGetConversations() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);

      try {
        const res = await makeRequest.get("message/get/all/conversations");
        if (res.data) {
          // console.log(res.data);
          setConversations(res.data);
        } else return showToast("Error", `Conversations Not Found 😥`, "error");
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [setConversations, showToast]);

  return { conversations, setConversations, loading };
}

export default useGetConversations;
