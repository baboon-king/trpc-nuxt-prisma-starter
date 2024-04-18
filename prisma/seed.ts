import { PrismaClient } from "@prisma/client";

const tags = [
  {
    name: "精选",
    background: "linear-gradient(-88deg, #e4daa8 0%, #fbf1d0 100%)",
    color: "#7b643e",
  },
  {
    name: "认证",
    background: "#e1e9fa",
    color: "#0052d9",
  },
  {
    name: "热卖",
    background: "#fce9e0",
    color: "#ed6d30",
  },
];
const schemeThemeNames = [
  "教育教学",
  "学科科研",
  "宣传文化",
  "人事管理",
  "学生管理",
  "后勤财务",
  "社会服务",
  "场地预约",
  "其他事项",
];

const schemeThemes = [...schemeThemeNames.map((name) => ({ name }))];

const suitableAudienceNames = ["教师", "学生", "校外人员"] as const;

const suitableAudiences = [...suitableAudienceNames.map((name) => ({ name }))];

const suitableDepartmentNames = [
  "办公室（发展规划处）",
  "组织部（统战部人才办）",
  "宣传部",
  "纪检监察室",
  "党委学生工作部、学生处",
  "研究生院（研究生工作部、学位办）",
  "人事处（教师工作部）",
  "教务处",
  "科研部",
  "医院管理处",
  "社会合作处（校友办）",
  "资产与实验室管理处",
  "计划财务处",
  "审计处",
  "药学院",
  "国际交流合作处（港澳台事务办公室）",
  "安全保卫处（人武部）",
  "后勤管理处",
  "校区管委会",
  "中医药科学院",
  "招标与采购中",
  "基础医学院",
  "国际教育学院",
  "创新创业学院",
  "体育部",
  "继续教育学院",
  "教师教学发展中心（高教研究所）",
  "图书馆",
  "信息技术中心",
  "团委",
  "博物馆",
] as const;

const areas = [
  { code: 110000, name: "北京市" },
  { code: 120000, name: "天津市" },
  { code: 130000, name: "河北省" },
  { code: 140000, name: "山西省" },
  { code: 150000, name: "内蒙古自治区" },
  { code: 210000, name: "辽宁省" },
  { code: 220000, name: "吉林省" },
  { code: 230000, name: "黑龙江省" },
  { code: 310000, name: "上海市" },
  { code: 320000, name: "江苏省" },
  { code: 330000, name: "浙江省", published: true },
  { code: 340000, name: "安徽省" },
  { code: 350000, name: "福建省" },
  { code: 360000, name: "江西省" },
  { code: 370000, name: "山东省" },
  { code: 410000, name: "河南省" },
  { code: 420000, name: "湖北省" },
  { code: 430000, name: "湖南省" },
  { code: 440000, name: "广东省" },
  { code: 450000, name: "广西壮族自治区" },
  { code: 460000, name: "海南省" },
  { code: 500000, name: "重庆市" },
  { code: 510000, name: "四川省" },
  { code: 520000, name: "贵州省" },
  { code: 530000, name: "云南省" },
  { code: 540000, name: "西藏自治区" },
  { code: 610000, name: "陕西省" },
  { code: 620000, name: "甘肃省" },
  { code: 630000, name: "青海省" },
  { code: 640000, name: "宁夏回族自治区" },
  { code: 650000, name: "新疆维吾尔自治区" },
  { code: 710000, name: "台湾省" },
  { code: 810000, name: "香港特别行政区" },
  { code: 820000, name: "澳门特别行政区" },
] as const;

const suitableDepartments = [
  ...suitableDepartmentNames.map((name) => ({ name })),
  // other
];

const prisma = new PrismaClient();

async function main() {
  const tagCreators = tags.map((tag) =>
    prisma.tag.create({
      data: {
        name: tag.name,
        color: tag.color,
        background: tag.background,
      },
    }),
  );

  const schemeThemeCreators = schemeThemes.map((schemeTheme) =>
    prisma.schemeTheme.create({
      data: {
        name: schemeTheme.name,
      },
    }),
  );

  const suitableAudienceCreators = suitableAudiences.map((suitableAudience) =>
    prisma.suitableAudience.create({
      data: {
        name: suitableAudience.name,
      },
    }),
  );

  const suitableDepartmentCreators = suitableDepartments.map((suitableDepartment) =>
    prisma.suitableDepartment.create({
      data: {
        name: suitableDepartment.name,
      },
    }),
  );

  const areaCreators = areas.map((area) =>
    prisma.area.create({
      data: { published: false, ...area },
    }),
  );

  await Promise.all([
    ...tagCreators,
    ...schemeThemeCreators,
    ...suitableAudienceCreators,
    ...suitableDepartmentCreators,
    ...areaCreators,
  ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
