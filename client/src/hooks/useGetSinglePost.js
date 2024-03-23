import { useEffect } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useGetSinglePost(pid) {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);

      try {
        const res = await makeRequest.get(`post/get/${pid}`);
        if (!res.data) return showToast("Error", "Error Get Post 😥", "error");
        else setPosts([res.data]);
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      }
    };
    getPost();
  }, [pid, setPosts, showToast]);

  return { posts };
}

export default useGetSinglePost;
