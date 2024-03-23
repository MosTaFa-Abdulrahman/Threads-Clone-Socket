import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { makeRequest } from "../requestMethod";

function useFollowUnFollow(user) {
  const currentUser = useRecoilValue(userAtom);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowToast();

  useEffect(() => {
    setIsFollowing(user?.followers?.includes(currentUser?._id));
  }, [user, currentUser?._id]);

  const handleFollowUnFollow = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      return showToast("Error", "Please login to follow this user 😍", "error");
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await makeRequest.post(`user/follow/${user._id}`);
      if (!res.data) {
        return showToast("Error", `You Can Not Follow this User 😥`, "error");
      }

      if (isFollowing) {
        // UnFollow
        showToast("Success", `Unfollowed ${user.name} 😍`, "success");
        user?.followers?.pop();
      } else {
        // Follow
        showToast("Success", `Followed ${user.name} 😘`, "success");
        user?.followers?.push(currentUser?._id);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      showToast("Error", `${error.message} 😥`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowing, isLoading, handleFollowUnFollow };
}

export default useFollowUnFollow;
