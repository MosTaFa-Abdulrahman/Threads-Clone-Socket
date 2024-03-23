import { Avatar, Image, Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import { makeRequest } from "../../requestMethod";
import { formatDistanceToNow } from "date-fns";
import Actions from "../actions/Actions";
import postsAtom from "../../atoms/postAtom";

// From Home
function Post({ post, postedBy }) {
  const currentUser = useRecoilValue(userAtom);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Using Get User By Query in ((Back-End))
        const res = await makeRequest.get(`user/get/${postedBy}`);
        if (res.data) setUser(res.data);
        else return showToast("Error", "User Not Found 😥", "error");
      } catch (error) {
        showToast("Error", `${error.message} 😥`, "error");
      }
    };
    getUser();
  }, [showToast, postedBy]);

  // Delete Post
  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await makeRequest.delete(`post/delete/${post._id}`);
      if (!res.data) return showToast("Error", "Error Delete Post 😥", "error");
      setPosts(posts.filter((p) => p._id !== post._id));
      showToast("Success", "Post Deleted Successfully 🥰", "success");
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    }
  };

  return (
    <Flex gap={3} mb={4} py={5}>
      <Flex flexDirection={"column"} alignItems={"center"}>
        <Link to={`/${user.username}`}>
          <Avatar size="md" name={user.name} src={user?.profilePic} />
        </Link>
        <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>

        <Box position={"relative"} w={"full"}>
          {post.replies?.length === 0 && <Text textAlign={"center"}>🥱</Text>}
          {post.replies[0] && (
            <Avatar
              size="xs"
              name={post.replies[0]?.username}
              src={post.replies[0]?.userProfilePic}
              position={"absolute"}
              top={"0px"}
              left="15px"
              padding={"2px"}
            />
          )}

          {post.replies[1] && (
            <Avatar
              size="xs"
              name={post.replies[1]?.username}
              src={post.replies[1]?.userProfilePic}
              position={"absolute"}
              bottom={"0px"}
              right="-5px"
              padding={"2px"}
            />
          )}

          {post.replies[2] && (
            <Avatar
              size="xs"
              name={post.replies[2]?.username}
              src={post.replies[2]?.userProfilePic}
              position={"absolute"}
              bottom={"0px"}
              left="4px"
              padding={"2px"}
            />
          )}
        </Box>
      </Flex>

      <Flex flex={1} flexDirection={"column"} gap={2}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex w={"full"} alignItems={"center"}>
            <Link to={`/${user.username}`}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {user?.username}
              </Text>
            </Link>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              width={36}
              textAlign={"right"}
              color={"gray.light"}
            >
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </Text>

            {currentUser?._id === user._id && (
              <DeleteIcon
                size={20}
                color="tomato"
                cursor="pointer"
                onClick={handleDeletePost}
              />
            )}
          </Flex>
        </Flex>

        <Link to={`/${user.username}/post/${post._id}`}>
          <Text fontSize={"sm"}>{post.text}</Text>
        </Link>
        {post?.img && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Link to={`/${user.username}/post/${post._id}`}>
              <Image src={post?.img} w={"full"} />
            </Link>
          </Box>
        )}

        <Flex gap={3} my={1}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Post;
