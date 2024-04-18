import { z } from "zod";

/**
 * pageIndex defaults 1 at input
 */
export const pagerZod = z.object({
  index: z.number().int().nonnegative().default(1),
  size: z.number().int().nonnegative().default(10),
});

export type Pager = z.infer<typeof pagerZod>;

export const paginationGen = (pager: z.infer<typeof pagerZod>) => {
  return {
    skip: (pager.index - 1) * pager.size,
    take: pager.size,
  };
};
