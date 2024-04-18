import { z } from "zod";

import { switchPublishedZod } from "../zod";

export const switchPublishedQueryGen = (input: z.infer<typeof switchPublishedZod>) =>
  ({
    where: {
      id: input.id,
    },
    data: { published: input.published },
  } as const);
