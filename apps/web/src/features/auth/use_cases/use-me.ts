import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";

export const useMe = () => useQuery(orpc.auth.me.queryOptions());
