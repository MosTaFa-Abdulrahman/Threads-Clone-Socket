import { Flex, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import UserHeader from "../components/user/UserHeader";
import Post from "../components/post/Post";
import useGetPostsForSpecialUser from "../hooks/useGetPostsForSpecialUser";
import useGetUserProfileByUsername from "../hooks/useGetUserProfileByUsername";

function User() {
  const { isLoading, user } = useGetUserProfileByUsername();
  const { username } = useParams();
  const { fetchingPosts, posts } = useGetPostsForSpecialUser(username);

  if (!user && isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !isLoading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />

      {!fetchingPosts && posts.length === 0 && <h1>User has not posts 😥😮</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post post={post} postedBy={post.postedBy} key={post._id} />
      ))}
    </>
  );
}

export default User;
