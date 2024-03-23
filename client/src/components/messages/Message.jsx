import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { BsCheck2All } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../../atoms/messageAtom";
import userAtom from "../../atoms/userAtom";

// From MessageContainer Component
function Message({ ownMessage, message }) {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"#ccc"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"brown"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          <Avatar src={currentUser?.profilePic} w={"7"} h={"7"} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation?.userProfilePic} w={"7"} h={"7"} />
          <Text
            maxW={"350px"}
            bg={"gray"}
            p={1}
            borderRadius={"md"}
            color={"white"}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default Message;
