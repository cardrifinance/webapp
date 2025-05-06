import { queryClient } from "@/components/layout/tanstackProvider";
import { fetchData } from "@/lib/api";
import { UserData } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const getUsersProfile = async (): Promise<
  UseQueryResult<AxiosResponse<any>>
> =>
  await queryClient.fetchQuery({
    queryKey: ["users profile"],
    queryFn: async () => {
      try {
        return await fetchData<UserData>(`/auth/user-datail`);
      } catch (error) {
        return null;
      }
    },
  });
