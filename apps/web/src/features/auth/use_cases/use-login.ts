import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const useLogin = () => useMutation(orpc.auth.login.mutationOptions());
