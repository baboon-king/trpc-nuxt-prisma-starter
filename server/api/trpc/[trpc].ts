import { createContext } from "@/server/trpc/context";
import { appRouter } from "@/trpc";
import { createNuxtApiHandler } from "trpc-nuxt";

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
});
