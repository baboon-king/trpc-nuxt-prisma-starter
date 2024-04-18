import { z } from "zod";

import { pagerZod, paginationGen } from "../pagination";
import { switchPublishedQueryGen } from "../prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { cuidArrayZod, switchPublishedZod } from "../zod";

const searchByPage = publicProcedure
  .input(
    z.object({
      name: z.string().optional(),
      pager: pagerZod,
    }),
  )
  .query(async ({ ctx, input }) => {
    const where = {
      name: {
        contains: input.name,
      },
    };

    const [data, count] = await ctx.prisma.$transaction([
      ctx.prisma.suitableAudience.findMany({
        ...paginationGen(input.pager),
        where,
      }),
      ctx.prisma.suitableAudience.count({
        where,
      }),
    ]);

    return {
      pagination: {
        count,
      },
      data,
    };
  });

const create = publicProcedure
  .input(
    z.object({
      name: z.string().max(191),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.suitableAudience.create({
      data: {
        name: input.name,
      },
    });
  });

const update = publicProcedure
  .input(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.suitableAudience.update({
      where: {
        id: input.id,
      },
      data: input,
    });
  });

const deleteByIds = publicProcedure.input(cuidArrayZod).mutation(({ ctx, input }) => {
  return ctx.prisma.suitableAudience.deleteMany({
    where: {
      id: {
        in: input,
      },
    },
  });
});

const switchPublished = publicProcedure.input(switchPublishedZod).mutation(({ ctx, input }) => {
  return ctx.prisma.suitableAudience.update(switchPublishedQueryGen(input));
});

const published = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.suitableAudience.findMany({
    where: {
      published: true,
    },
  });
});

export const suitableAudience = createTRPCRouter({
  published,
  searchByPage,
  update,
  create,
  deleteByIds,
  switchPublished,
});