import { useQuery } from "@tanstack/react-query";

export type UserData = {
  username: string;
  token?: string;
};

export const useUserData = () => {
  const token = useQuery<UserData>({
    queryKey: ["user-data"],
  });
  return token;
};
