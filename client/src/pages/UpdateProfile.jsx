import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../requestMethod";
import upload from "../upload";

// bcrypt Password Before Sending to API
import bcrypt from "bcryptjs";

function UpdateProfile() {
  const [user, setUser] = useRecoilState(userAtom);
  const [profileFile, setProfileFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useShowToast();
  const navigate = useNavigate();

  // hash password before sending to api
  // const salt = bcrypt.genSaltSync(10);
  // const hashedPassword = bcrypt.hashSync(password, parseInt(salt));

  useEffect(() => {
    setUserName(user?.username);
    setName(user?.name);
    setBio(user?.bio);
    setEmail(user?.email);
    setPassword(user?.password);
  }, [user?.email, user?.username, user?.name, user?.bio, user?.password]);

  // Update User Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !bio) {
      return showToast("Warning", "Fill All This Fields Please 😍", "warning");
    }
    if (password.length < 6) {
      return showToast("Error", "Password less than 6 Items 🙄", "error");
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      let profileUrl;
      profileUrl = profileFile ? await upload(profileFile) : user?.profilePic;

      const res = await makeRequest.put(`user/update/${user._id}`, {
        username,
        name,
        email,
        bio,
        password,
        // password: hashedPassword,
        profilePic: profileUrl,
      });
      showToast("Success", "Profile updated successfully 🥰", "success");
      setUser(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setProfileFile(null);
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={3}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>

        <FormControl id="userName">
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                boxShadow={"md"}
                src={
                  profileFile
                    ? URL.createObjectURL(profileFile)
                    : user.profilePic
                }
              />
            </Center>
            <Center w="full">
              <Input
                type="file"
                id="profileFile"
                // style={{ display: "none" }}
                onChange={(e) => setProfileFile(e.target.files[0])}
              />
            </Center>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            name="username"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            name="bio"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>

        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
            type="submit"
            isLoading={isLoading}
            onClick={handleUpdate}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default UpdateProfile;
