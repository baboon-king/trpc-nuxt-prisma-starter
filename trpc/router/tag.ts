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
      ctx.prisma.tag.findMany({
        ...paginationGen(input.pager),
        where,
      }),
      ctx.prisma.tag.count({
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
      name: z.string(),
      color: z.string(),
      background: z.string(),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.tag.create({
      data: input,
    });
  });

const update = publicProcedure
  .input(
    z.object({
      id: z.string().cuid(),
      name: z.string(),
      color: z.string(),
      background: z.string(),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.tag.update({
      where: {
        id: input.id,
      },
      data: input,
    });
  });

const switchPublished = publicProcedure.input(switchPublishedZod).mutation(({ ctx, input }) => {
  return ctx.prisma.tag.update(switchPublishedQueryGen(input));
});

const deleteByIds = publicProcedure.input(cuidArrayZod).mutation(({ ctx, input }) => {
  return ctx.prisma.tag.deleteMany({
    where: {
      id: {
        in: input,
      },
    },
  });
});

const published = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.tag.findMany({
    where: {
      published: true,
    },
  });
});

export const tag = createTRPCRouter({
  published,
  searchByPage,
  create,
  update,
  deleteByIds,
  switchPublished,
});
