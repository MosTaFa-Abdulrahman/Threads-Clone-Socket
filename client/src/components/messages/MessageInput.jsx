import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { makeRequest } from "../../requestMethod";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../../atoms/messageAtom";

// From MessageContainer Component
function MessageInput({ setMessages }) {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText)
      return showToast("Warning", `Please Write Your Message 🥰`, "warning");

    try {
      const res = await makeRequest.post("message/send", {
        recipientId: selectedConversation.userId,
        message: messageText,
      });
      setMessages((messages) => [...messages, res.data]);
      setMessageText("");
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Write your message 😍"
          border="1px solid gray"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

export default MessageInput;
