import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postAtom";
import userAtom from "../atoms/userAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useGetPostsForSpecialUser(username) {
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getPostsSpecialUser = async () => {
      if (!user) return showToast("Error", `User Not Found 😥!`, "error");
      setFetchingPosts(true);

      try {
        const res = await makeRequest.get(`post/profile/${username}`);
        if (res.data) {
          setPosts(res.data);
        } else return showToast("Error", `User Posts Not Found 😥!`, "error");
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      } finally {
        setFetchingPosts(false);
      }
    };
    getPostsSpecialUser();
  }, [username, setPosts, user, showToast]);

  return { fetchingPosts, posts };
}

export default useGetPostsForSpecialUser;
