import { env } from "@dtask/env/web";
import type { AppType } from "@dtask/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import {
  createTanstackQueryUtils,
  TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL,
  type TanstackQueryOperationContext,
} from "@orpc/tanstack-query";

interface ClientContext extends TanstackQueryOperationContext { }

const GET_OPERATION_TYPE = new Set(["query", "streamed", "live", "infinite"]);

const link = new RPCLink<ClientContext>({
  url: `${env.VITE_SERVER_URL}/rpc`,
  fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),

  method: ({ context }, _path) => {
    const operationType =
      context[TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL]?.type;

    if (operationType && GET_OPERATION_TYPE.has(operationType)) {
      return "GET";
    }

    return "POST";
  },
});

const client = createORPCClient<AppType>(link);
export const orpc = createTanstackQueryUtils(client);
