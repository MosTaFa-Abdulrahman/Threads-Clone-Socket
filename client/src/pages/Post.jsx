import {
  Avatar,
  Box,
  Flex,
  Image,
  Text,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import Actions from "../components/actions/Actions";
import useGetUserProfileByUsername from "../hooks/useGetUserProfileByUsername";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useGetSinglePost from "../hooks/useGetSinglePost";
import { NavLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { makeRequest } from "../requestMethod";

function Post() {
  const { isLoading, user } = useGetUserProfileByUsername();
  const { pid } = useParams();
  const { posts: AllPosts } = useGetSinglePost(pid);

  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentPost = AllPosts[0];

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await makeRequest.delete(`post/delete/${currentPost._id}`);
      if (!res.data) return showToast("Error", "Error Delete Post 😥", "error");

      showToast("Success", "Post Deleted Successfully 😍", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    }
  };

  const handleDeleteReply = async (postId, replyId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this Comment ?"))
        return;
      const res = await makeRequest.delete(`post/${postId}/replies/${replyId}`);
      if (!res.data)
        return showToast("Error", "Error Delete Comment 😥", "error");

      showToast("Success", "Comment Deleted Successfully 😍", "success");
      window.location.reload();
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    }
  };

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <NavLink to={`/${user.username}`}>
            <Avatar src={user?.profilePic} size={"md"} name={user.username} />
          </NavLink>
          <Flex>
            <NavLink to={`/${user.username}`}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user.username}
              </Text>
            </NavLink>
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              color="tomato"
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost?.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Get the app to like, reply and post 🤩
          </Text>
        </Flex>
        <NavLink
          to="https://play.google.com/store/apps/details?id=com.instagram.barcelona&hl=en&gl=US"
          target="_blank"
        >
          <Button>Get</Button>
        </NavLink>
      </Flex>

      <Divider my={4} />

      {currentPost?.replies?.map((reply) => (
        <div key={reply._id}>
          <Flex gap={4} py={2} my={2} w={"full"}>
            <NavLink to={`/${reply.username}`}>
              <Avatar src={reply.userProfilePic} size={"sm"} />
            </NavLink>
            <Flex gap={1} w={"full"} flexDirection={"column"}>
              <Flex
                w={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text fontSize="sm" fontWeight="bold">
                  {reply.username}
                </Text>
              </Flex>
              <Text>{reply.text}</Text>
            </Flex>

            {currentUser._id === reply.userId && (
              <Button
                color={"red"}
                onClick={() => handleDeleteReply(currentPost?._id, reply?._id)}
              >
                Delete
              </Button>
            )}
          </Flex>

          {reply._id ===
          currentPost?.replies[currentPost.replies?.length - 1]._id ? (
            <Divider />
          ) : null}
        </div>
      ))}
    </>
  );
}

export default Post;
