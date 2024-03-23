import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postAtom";
import userAtom from "../atoms/userAtom";
import { makeRequest } from "../requestMethod";
import useShowToast from "./useShowToast";

function useLikeDisLikePost(post) {
  const [isLiking, setIsLiking] = useState(false);
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  const handleLikeAndUnlike = async () => {
    if (!user) {
      return showToast(
        "Error",
        "You must be logged in to like a post 😎",
        "error"
      );
    }
    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await makeRequest.put(`post/like/${post._id}`);
      if (!res.data) return showToast("Error", "Error Liked 😥", "error");

      if (!liked) {
        // ADD ((ID)) of currentUser to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        // Remove ((ID)) of currentUser to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }

      setLiked(!liked);
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setIsLiking(false);
    }
  };

  return { handleLikeAndUnlike, liked };
}

export default useLikeDisLikePost;
