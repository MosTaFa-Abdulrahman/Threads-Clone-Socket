import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useGetFeedFriendsPosts() {
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getFeedFriendsPosts = async () => {
      setLoading(true);
      setPosts([]);

      try {
        const res = await makeRequest.get("post/feed");
        if (res.data) {
          setPosts(res.data);
        } else return showToast("Error", `Posts Not Found 😥`, "error");
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedFriendsPosts();
  }, [setPosts, showToast]);

  return { posts, loading };
}

export default useGetFeedFriendsPosts;
