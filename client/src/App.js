import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Settings from "./pages/Settings";
import UpdateProfile from "./pages/UpdateProfile";
import User from "./pages/User";
import CreatePost from "./components/post/CreatePost";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <Box position={"relative"} w="full">
      <Container
        maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" />}
          />
          <Route path="/:username/post/:pid" element={<Post />} />
          <Route
            path="/update"
            element={user ? <UpdateProfile /> : <Navigate to="/auth" />}
          />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <User />
                  <CreatePost />
                </>
              ) : (
                <User />
              )
            }
          />

          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/auth" />}
          />
          <Route
            path="/settings"
            element={user ? <Settings /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
