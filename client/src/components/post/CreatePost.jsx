import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../../atoms/userAtom";
import postsAtom from "../../atoms/postAtom";
import { makeRequest } from "../../requestMethod";
import upload from "../../upload";

function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const user = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const showToast = useShowToast();

  const handleCreatePost = async () => {
    if (!text) {
      return showToast("Warning", "Please Enter Your Text 😊", "warning");
    }
    if (loading) return;
    setLoading(true);

    try {
      const imgUrl = await upload(file);
      const res = await makeRequest.post("post/create", {
        text,
        img: imgUrl,
        postedBy: user._id,
      });
      showToast("Success", "Post Created Successfully 😍", "success");
      if (username === user.username) {
        setPosts([res.data, ...posts]);
      }

      setText("");
      setFile("");
      onClose();
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user.username === username && (
        <Button
          position={"fixed"}
          bottom={10}
          right={5}
          onClick={onOpen}
          size={{ base: "sm", sm: "md" }}
        >
          <AddIcon />
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder={`Write Your Text Please Sir ${user.username} 🥰`}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <Input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />

              <label htmlFor="file">
                <BsFillImageFill
                  id="file"
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                />
              </label>
            </FormControl>

            <Flex mt={5} w={"full"} position={"relative"}>
              {file && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Selected img"
                  maxHeight={400}
                />
              )}

              <CloseButton
                bg={"gray.800"}
                position={"absolute"}
                top={2}
                right={2}
                onClick={() => setFile(null)}
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={loading}
              onClick={handleCreatePost}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost;
