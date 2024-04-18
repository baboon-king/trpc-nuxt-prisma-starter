import { inferAsyncReturnType } from "@trpc/server";
import { getServerSession } from "#auth";
import { type H3Event } from "h3";

import { createInnerTRPCContext } from "~/trpc/trpc";

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createContext = async (event: H3Event) => {
  const { prisma } = createInnerTRPCContext();

  return {
    prisma,
    session: await getServerSession(event),
  } as const;
};

export type CreateContext = typeof createContext;

export type Context = inferAsyncReturnType<CreateContext>;
