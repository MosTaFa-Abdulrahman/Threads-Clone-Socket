import { Box, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/post/Post";
import useGetFeedFriendsPosts from "../hooks/useGetFeedFriendsPosts";
import SuggestedUsers from "../components/suggestedUsers/SuggestedUsers";

function Home() {
  const { posts, loading } = useGetFeedFriendsPosts();

  return (
    <Flex gap="10" alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {posts.map((post) => (
          <Post post={post} postedBy={post.postedBy} key={post._id} />
        ))}
      </Box>

      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
}

export default Home;
