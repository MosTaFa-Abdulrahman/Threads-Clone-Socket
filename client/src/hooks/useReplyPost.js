// import { useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import postsAtom from "../atoms/postAtom";
// import userAtom from "../atoms/userAtom";
// import { makeRequest } from "../requestMethod";
// import useShowToast from "./useShowToast";

// function useReplyPost(post) {
//   const [isReplying, setIsReplying] = useState(false);
//   const user = useRecoilValue(userAtom);
//   const [posts, setPosts] = useRecoilState(postsAtom);
//   const showToast = useShowToast();

//   const handleReply = async (text) => {
//     if (!user) {
//       return showToast(
//         "Error",
//         "You must be logged in to like a post 😎",
//         "error"
//       );
//     }
//     if (isReplying) return;
//     setIsReplying(true);

//     try {
//       const res = await makeRequest.put(`post/reply/${post._id}`, text);
//       if (!res.data) return showToast("Error", "you can not reply 😥", "error");

//       const updatedPosts = posts.map((p) => {
//         if (p._id === post._id) {
//           return { ...p, replies: [...p.replies, res.data] };
//         }
//         return p;
//       });
//       setPosts(updatedPosts);
//       showToast("Success", "Reply posted successfully", "success");
//     } catch (error) {
//       showToast("Error", `${error.message} 😥`, "error");
//     } finally {
//       setIsReplying(false);
//     }
//   };

//   return { handleReply, isReplying };
// }

// export default useReplyPost;
