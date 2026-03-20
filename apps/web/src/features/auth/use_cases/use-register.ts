import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const useRegister = () =>
  useMutation(orpc.auth.register.mutationOptions());
