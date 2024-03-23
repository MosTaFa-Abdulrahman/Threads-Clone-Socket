import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/conversation/Conversation";
import MessageContainer from "../components/messages/MessageContainer";
import useGetConversations from "../hooks/useGetConversations";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messageAtom";
import { useEffect, useState } from "react";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext";

function Chat() {
  const { conversations, setConversations, loading } = useGetConversations();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  const [searchText, setSearchText] = useState("");
  const [searchingLoading, setSearchingLoading] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();

  const { socket, onlineUsers } = useSocket();

  // Handle Seen
  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  // Focus (((🌿🧠)))
  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/get/${searchText}`
      );
      const searchUser = await res.json();
      if (searchUser.error) {
        return showToast("Error", `${searchUser.error} 😥`, "error");
      }

      // trying message yourself
      const messagingYourself = searchUser._id === currentUser._id;
      if (messagingYourself) {
        return showToast("Error", "You cannot message yourself 😮🤨", "error");
      }

      // if you messeage user you messeaged before
      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchUser._id
      );
      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchUser._id,
          username: searchUser.username,
          userProfilePic: searchUser.profilePic,
        });
        return;
      }

      // (Create new Fake Conversation) ((Focus 🧠))
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchUser?._id,
            username: searchUser?.username,
            profilePic: searchUser?.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setSearchingLoading(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations 😍
          </Text>

          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search User 🥰"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingLoading}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {/* Skelton Loading */}
          {loading &&
            [0, 1, 2, 3].map((_, i) => (
              <Flex
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
                key={i}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {/* Skelton Loading */}

          {!loading &&
            conversations.map((c) => (
              <Conversation
                conversation={c}
                key={c._id}
                isOnline={onlineUsers.includes(c.participants[0]._id)}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
}

export default Chat;
