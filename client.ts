// @filename: client.ts

import type { RouterInputs, RouterOutputs } from "~/trpc";

export type TagCreateInput = RouterInputs["tag"]["create"];
export type TagCreateOutput = RouterOutputs["tag"]["create"];

export type TagUpdateInput = RouterInputs["tag"]["update"];
export type TagUpdateOutput = RouterOutputs["tag"]["update"];

export type SchemeCreateInput = RouterInputs["scheme"]["create"];
export type SchemeCreateOutput = RouterOutputs["scheme"]["create"];

export type SchemeUpdateInput = RouterInputs["scheme"]["update"];

export type SchemeSearchByPageInput = RouterInputs["scheme"]["searchByPage"];
export type SchemeSearchByPageOutput = RouterOutputs["scheme"]["searchByPage"];

export type SchemeThemeCreateInput = RouterInputs["schemeTheme"]["create"];
export type SchemeThemeCreateOutput = RouterOutputs["schemeTheme"]["create"];

export type SchemeThemePublishedInput = RouterInputs["schemeTheme"]["published"];
export type SchemeThemePublishedOutput = RouterOutputs["schemeTheme"]["published"];

export type SchemeThemeUpdateInput = RouterInputs["schemeTheme"]["update"];
export type SchemeThemeUpdateOutput = RouterOutputs["schemeTheme"]["update"];

export type SuitableDepartmentCreateInput = RouterInputs["suitableDepartment"]["create"];
export type SuitableDepartmentCreateOutput = RouterOutputs["suitableDepartment"]["create"];

export type SuitableDepartmentPublishedInput = RouterInputs["suitableDepartment"]["published"];
export type SuitableDepartmentPublishedOutput = RouterOutputs["suitableDepartment"]["published"];

export type SuitableDepartmentUpdateInput = RouterInputs["suitableDepartment"]["update"];
export type SuitableDepartmentUpdateOutput = RouterOutputs["suitableDepartment"]["update"];

export type SuitableAudienceCreateInput = RouterInputs["suitableAudience"]["create"];
export type SuitableAudienceCreateOutput = RouterOutputs["suitableAudience"]["create"];

export type SuitableAudiencePublishedInput = RouterInputs["suitableAudience"]["published"];
export type SuitableAudiencePublishedOutput = RouterOutputs["suitableAudience"]["published"];

export type SuitableAudienceUpdateInput = RouterInputs["suitableAudience"]["update"];
export type SuitableAudienceUpdateOutput = RouterOutputs["suitableAudience"]["update"];

export type SwiperCreateInput = RouterInputs["swiper"]["create"];
export type SwiperCreateOutput = RouterOutputs["swiper"]["create"];

export type SwiperPublishedInput = RouterInputs["swiper"]["published"];
export type SwiperPublishedOutput = RouterOutputs["swiper"]["published"];

export type SwiperUpdateInput = RouterInputs["swiper"]["update"];
export type SwiperUpdateOutput = RouterOutputs["swiper"]["update"];

export type SchemeSearchByMultiConditionGroupByThemeInput =
  RouterInputs["scheme"]["searchByMultiConditionGroupByTheme"];
export type SchemeSearchByMultiConditionGroupByThemeOutput =
  RouterOutputs["scheme"]["searchByMultiConditionGroupByTheme"];

export type SchemeByIdOutput = RouterOutputs["scheme"]["byId"];

export type SchemeZanInput = RouterInputs["scheme"]["zan"];
export type SchemeZanOutput = RouterOutputs["scheme"]["zan"];

export type AreaPublishedOutput = RouterOutputs["area"]["published"];
