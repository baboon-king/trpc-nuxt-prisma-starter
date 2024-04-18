import { z } from "zod";

import { pagerZod, paginationGen } from "../pagination";
import { switchPublishedQueryGen } from "../prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { cuidArrayZod, switchPublishedZod } from "../zod";

const searchByPage = publicProcedure
  .input(
    z.object({
      title: z.string().max(191).optional(),
      subTitle: z.string().max(191).optional(),
      pager: pagerZod,
    }),
  )
  .query(async ({ ctx, input }) => {
    const where = {
      title: {
        contains: input.title,
      },
      subTitle: {
        contains: input.subTitle,
      },
    };

    const [data, count] = await ctx.prisma.$transaction([
      ctx.prisma.swiper.findMany({
        ...paginationGen(input.pager),
        where,
      }),
      ctx.prisma.swiper.count({
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

const update = publicProcedure
  .input(
    z.object({
      id: z.string().cuid(),
      image: z.string().max(191),
      title: z.string().max(191),
      subTitle: z.string().max(191),
      btnText: z.string().max(191),
      target: z.string().max(191),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.swiper.update({
      where: {
        id: input.id,
      },
      data: input,
    });
  });

const create = publicProcedure
  .input(
    z.object({
      image: z.string().max(191),
      title: z.string().max(191),
      subTitle: z.string().max(191),
      btnText: z.string().max(191),
      target: z.string().max(191),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.prisma.swiper.create({
      data: input,
    });
  });

const deleteByIds = publicProcedure.input(cuidArrayZod).mutation(({ ctx, input }) => {
  return ctx.prisma.swiper.deleteMany({
    where: {
      id: {
        in: input,
      },
    },
  });
});

const switchPublished = publicProcedure.input(switchPublishedZod).mutation(({ ctx, input }) => {
  return ctx.prisma.swiper.update(switchPublishedQueryGen(input));
});

const published = publicProcedure.query(({ ctx }) => {
  return ctx.prisma.swiper.findMany({
    where: { published: true },
  });
});
export const swiper = createTRPCRouter({
  published,
  create,
  update,
  searchByPage,
  deleteByIds,
  switchPublished,
});
