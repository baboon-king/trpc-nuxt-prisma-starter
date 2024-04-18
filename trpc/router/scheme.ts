import { z } from "zod";

import { pagerZod, paginationGen } from "../pagination";
import { initialGen } from "../pingyin";
import { switchPublishedQueryGen } from "../prisma";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { cuidArrayZod, cuidZod, purchaseZod, schemeBasicZod, schemeRelation, switchPublishedZod } from "../zod";
import { schemeTheme } from "./schemeTheme";

const defaultsInclude = {
  suitableAudiences: true,
  themes: true,
  tags: true,
  suitableDepartments: true,
  purchases: {
    include: {
      area: true,
    },
  },
};

const searchByPage = publicProcedure
  .input(
    z.object({
      title: z.string().optional(),
      subTitle: z.string().optional(),
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
      ctx.prisma.scheme.findMany({
        ...paginationGen(input.pager),
        where,
        include: defaultsInclude,
      }),
      ctx.prisma.scheme.count({
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

const byId = publicProcedure.input(cuidZod).query(({ ctx, input }) => {
  return ctx.prisma.scheme.findFirst({
    where: { id: input },
    include: defaultsInclude,
  });
});

const create = publicProcedure
  .input(
    z.object({
      basic: schemeBasicZod,
      relation: schemeRelation.merge(
        z.object({
          purchases: z.array(purchaseZod),
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const purchaseResult = await ctx.prisma.$transaction(
      input.relation.purchases.map((purchase) => {
        const { name, address } = purchase;
        return ctx.prisma.purchase.create({
          data: {
            name,
            address,
            area: {
              connect: {
                id: purchase.areaId,
              },
            },
          },
        });
      }),
    );

    const { title, subTitle } = input.basic;
    const initial = initialGen([title, subTitle]);
    return await ctx.prisma.scheme.create({
      data: {
        ...input.basic,
        initial,
        tags: {
          connect: input.relation.tagIds.map((id) => ({ id })),
        },
        suitableAudiences: {
          connect: input.relation.suitableAudienceIds.map((id) => ({
            id,
          })),
        },
        suitableDepartments: {
          connect: input.relation.suitableDepartmentIds.map((id) => ({
            id,
          })),
        },
        themes: {
          connect: input.relation.themeIds.map((id) => ({ id })),
        },
        purchases: {
          connect: purchaseResult.map(({ id }) => ({ id })),
        },
      },
    });
  });

const update = publicProcedure
  .input(
    z.object({
      basic: z.object({ id: cuidZod }).merge(schemeBasicZod),
      relation: schemeRelation.merge(
        z.object({
          purchases: z.array(
            purchaseZod.merge(
              z.object({
                id: cuidZod.optional(),
              }),
            ),
          ),
        }),
      ),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const purchaseResult = await ctx.prisma.$transaction(
      input.relation.purchases.map((purchase) => {
        const { name, address } = purchase;
        return ctx.prisma.purchase.upsert({
          where: { id: purchase.id || "" },
          create: {
            name,
            address,
            area: {
              connect: {
                id: purchase.areaId,
              },
            },
          },
          update: {
            name,
            address,
            area: {
              connect: {
                id: purchase.areaId,
              },
            },
          },
        });
      }),
    );

    const { title, subTitle } = input.basic;
    const initial = initialGen([title, subTitle]);

    return ctx.prisma.scheme.update({
      where: {
        id: input.basic.id,
      },
      data: {
        ...input.basic,
        initial,
        tags: {
          set: input.relation.tagIds.map((id) => ({ id })),
        },
        suitableAudiences: {
          set: input.relation.suitableAudienceIds.map((id) => ({
            id,
          })),
        },
        suitableDepartments: {
          set: input.relation.suitableDepartmentIds.map((id) => ({
            id,
          })),
        },
        themes: {
          set: input.relation.themeIds.map((id) => ({ id })),
        },
        purchases: {
          set: purchaseResult.map(({ id }) => ({ id })),
        },
      },
      include: {
        purchases: {
          include: {
            area: true,
          },
        },
      },
    });
  });

const deleteByIds = publicProcedure.input(cuidArrayZod).mutation(({ ctx, input }) => {
  return ctx.prisma.scheme.deleteMany({
    where: {
      id: {
        in: input,
      },
    },
  });
});

const searchByMultiConditionGroupByTheme = publicProcedure
  .input(
    z.object({
      keyword: z.string().optional(),
      suitableAudienceId: z.string().optional(),
      suitableDepartmentId: z.string().optional(),
      themeId: z.string().optional(),
      initial: z.string().optional(),
      areaId: z.string().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const purchases = input.areaId
      ? {
          some: {
            area: {
              id: input.areaId,
            },
          },
        }
      : {
          every: {
            area: {
              id: input.areaId,
            },
          },
        };
    const result = await ctx.prisma.schemeTheme.findMany({
      where: {
        id: input.themeId,
        schemes: {
          some: {
            id: {
              not: "",
            },
          },
        },
      },
      include: {
        schemes: {
          where: {
            published: true,
            AND: [
              {
                suitableAudiences: {
                  some: {
                    id: input.suitableAudienceId,
                  },
                },
              },
              {
                purchases,
              },
              {
                suitableDepartments: {
                  some: {
                    id: input.suitableDepartmentId,
                  },
                },
              },
            ],
            OR: [
              {
                title: {
                  contains: input.keyword,
                },
              },
              {
                subTitle: {
                  contains: input.keyword,
                },
              },
            ],
            initial: {
              contains: input.initial,
            },
          },
          include: {
            tags: true,
          },
          orderBy: {
            sortLevel: "asc",
          },
        },
      },
      orderBy: {
        sortLevel: "asc",
      },
    });
    return result.filter((item) => item.schemes.length > 0);
  });

const switchPublished = publicProcedure.input(switchPublishedZod).mutation(({ ctx, input }) => {
  return ctx.prisma.scheme.update(switchPublishedQueryGen(input));
});

const zan = publicProcedure.input(cuidZod).mutation(async ({ ctx, input }) => {
  const scheme = await ctx.prisma.scheme.findFirst({
    where: { id: input },
  });

  return ctx.prisma.scheme.update({
    where: { id: input },
    data: {
      zan: scheme!.zan + 1,
    },
  });
});
export const scheme = createTRPCRouter({
  searchByPage,
  byId,
  update,
  create,
  deleteByIds,
  switchPublished,
  searchByMultiConditionGroupByTheme,
  zan,
});
