import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import useFollowUnFollow from "../../hooks/useFollowUnFollow";
import { Link } from "react-router-dom";

// From suggestedUsers Component
function SuggestedUser({ user }) {
  const { isFollowing, isLoading, handleFollowUnFollow } =
    useFollowUnFollow(user);

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>

      <Button
        size={"sm"}
        color={isFollowing ? "black" : "white"}
        bg={isFollowing ? "white" : "blue.400"}
        onClick={handleFollowUnFollow}
        isLoading={isLoading}
        _hover={{
          color: isFollowing ? "black" : "white",
          opacity: ".8",
        }}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </Flex>
  );
}

export default SuggestedUser;
