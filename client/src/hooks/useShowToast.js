import { useCallback } from "react";
import { useToast } from "@chakra-ui/react";

function useShowToast() {
  const toast = useToast();

  // to prevent infinite loop, by  caching the function
  const showToast = useCallback(
    (title, description, status) => {
      toast({ title, description, status, duration: 2000, isClosable: true });
    },
    [toast]
  );

  return showToast;
}

export default useShowToast;
