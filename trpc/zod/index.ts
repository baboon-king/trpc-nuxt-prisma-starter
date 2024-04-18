import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]));

export const cuidZod = z.string().cuid();

export const cuid2Zod = z.string().cuid2();

export const cuidArrayZod = z.array(cuidZod).min(1);

export const purchaseZod = z.object({
  address: z.string().url(),
  name: z.string(),
  areaId: cuidZod,
});

export const purchaseWithIdZod = purchaseZod.merge(z.object({ id: cuidZod }));

export const switchPublishedZod = z.object({
  id: z.string().cuid(),
  published: z.boolean(),
});

export const schemeRelation = z.object({
  themeIds: z.array(cuidZod),
  suitableAudienceIds: z.array(cuidZod),
  suitableDepartmentIds: z.array(cuidZod),
  tagIds: z.array(cuidZod),
});

export const schemeBasicZod = z.object({
  title: z.string().max(119).min(4),
  subTitle: z.string().max(119),
  backgroundTheme: z.string(),
  mainImage: z.string(),
  price: z.string().optional(),
  resource: z.string(),
  detail: z.any(),
  enjoyAddress: z.string().optional(),
});
