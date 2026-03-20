import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpc.auth.logout.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.auth.me.key() });
    },
  });
};
