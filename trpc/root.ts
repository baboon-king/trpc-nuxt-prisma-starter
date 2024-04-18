import { area } from "./router/area";
import { scheme } from "./router/scheme";
import { schemeTheme } from "./router/schemeTheme";
import { suitableAudience } from "./router/suitableAudience";
import { suitableDepartment } from "./router/suitableDepartment";
import { swiper } from "./router/swiper";
import { tag } from "./router/tag";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  area,
  scheme,
  tag,
  schemeTheme,
  suitableAudience,
  suitableDepartment,
  swiper,
});

// export type definition of API
export type AppRouter = typeof appRouter;
