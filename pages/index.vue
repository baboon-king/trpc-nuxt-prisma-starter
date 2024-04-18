<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";

import swiperUrl from "~/assets/swiper/swiper_default.png";
import {
  AreaPublishedOutput,
  SchemeSearchByMultiConditionGroupByThemeInput,
  SchemeThemePublishedOutput,
  SuitableAudiencePublishedOutput,
  SuitableDepartmentPublishedOutput,
  SwiperPublishedOutput,
} from "~/client";

const { $client } = useNuxtApp();

const { data } = useAuth();

const isAdmin = computed(() => {
  if (Array.isArray(data.value?.user.role)) {
    return data.value?.user.role.some((item) => item === "Administrator");
  }
  return false;
});

const letter = ref<string[]>(Array.from(new Array(26), (ele, index) => String.fromCharCode(65 + index)));

const searchRef = ref<HTMLDivElement>();

const swiperList = ref<SwiperPublishedOutput>([
  {
    id: "1",
    image: swiperUrl,
    title: "多重场景应用 多种解决方案",
    subTitle: "业务全新设计新品界面",
    btnText: "查看更多",
    target: "default",
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    sortLevel: 1,
  },
]);

const suitableAudience = ref<SuitableAudiencePublishedOutput>([]);
const suitableDepartment = ref<SuitableDepartmentPublishedOutput>([]);
const schemeTheme = ref<SchemeThemePublishedOutput>([]);
const area = ref<AreaPublishedOutput>([]);
const search = ref<SchemeSearchByMultiConditionGroupByThemeInput>({
  keyword: "",
});

const { data: schemeWithThemeList, refresh } = await $client.scheme.searchByMultiConditionGroupByTheme.useQuery(
  computed(() => ({ ...search.value })),
);

const { data: swiperResult } = await useAsyncData(() => $client.swiper.published.query());

swiperList.value.push(...swiperResult.value!);

const mixFirstOption = <T,>(result: T[]) => {
  return [
    {
      name: "全部",
    } as T,
    ...result,
  ];
};

const { data: suitableAudienceResult } = await $client.suitableAudience.published.useQuery();

suitableAudience.value = mixFirstOption(suitableAudienceResult.value);

const { data: suitableDepartmentResult } = await $client.suitableDepartment.published.useQuery();

suitableDepartment.value = mixFirstOption(suitableDepartmentResult.value);

const { data: schemeThemeResult } = await $client.schemeTheme.published.useQuery();

schemeTheme.value = mixFirstOption(schemeThemeResult.value);

const { data: areaResult } = await $client.area.published.useQuery();

area.value = mixFirstOption(areaResult.value);

const handleTarget = (target: string) => {
  if (target === "default") {
    searchRef.value?.scrollIntoView({
      behavior: "smooth",
    });
    return;
  }

  window.open(target);
};
</script>

<template>
  <ElCarousel height="500px">
    <ElCarouselItem v-for="(item, index) of swiperList" :key="index">
      <div class="header" :style="{ 'background-image': 'url(' + item.image + ')' }">
        <div class="head">
          <p class="logo">
            <img src="~/assets/logo/icon.png" alt="logo" h-60px />
          </p>
          <p class="title">{{ item.title }}</p>
          <p class="info">{{ item.subTitle }}</p>
          <el-button class="btn" @click="handleTarget(item.target)">
            {{ item.btnText }}
          </el-button>
        </div>
      </div>
    </ElCarouselItem>
  </ElCarousel>
  <div ref="searchRef" class="search">
    <div class="content">
      <div class="content-left">
        <input v-model="search.keyword" type="text" placeholder="请输入关键词" />
      </div>
      <el-button class="search-btn" :icon="Search" @click="refresh()"> 搜索 </el-button>
    </div>
    <div class="advanced-search">
      <div class="advanced-search-item">
        <p class="search-title">办理对象</p>
        <p class="item">
          <span
            v-for="item of suitableAudience"
            :key="item.id"
            :class="item.id === search.suitableAudienceId ? 'active' : ''"
            @click="search.suitableAudienceId = item.id"
          >
            {{ item.name }}
          </span>
        </p>
      </div>
      <div class="advanced-search-item">
        <p class="search-title">事项主题</p>
        <p class="item">
          <template v-for="item of schemeTheme">
            <span :class="item.id === search.themeId ? 'active' : ''" @click="search.themeId = item.id">
              {{ item.name }}
            </span>
          </template>
        </p>
      </div>
      <div class="advanced-search-item">
        <p class="search-title">办理部门</p>
        <p class="item">
          <template v-for="item of suitableDepartment">
            <span
              :class="item.id === search.suitableDepartmentId ? 'active' : ''"
              @click="search.suitableDepartmentId = item.id"
            >
              {{ item.name }}
            </span>
          </template>
        </p>
      </div>
      <div v-if="area.length > 0" class="advanced-search-item">
        <p class="search-title">地区</p>
        <p class="item">
          <template v-for="item of area">
            <span :class="item.id === search.areaId ? 'active' : ''" @click="search.areaId = item.id">
              {{ item.name }}
            </span>
          </template>
        </p>
      </div>
      <div class="advanced-search-item">
        <p class="search-title">首字母</p>
        <p class="item">
          <span :class="search.initial === undefined ? 'active' : ''" @click="search.initial = undefined">全部</span>
          <template v-for="(item, index) of letter">
            <span :class="item === search.initial ? 'active' : ''" @click="search.initial = item">
              {{ item }}
            </span>
          </template>
        </p>
      </div>
    </div>
  </div>
  <div class="scheme">
    <div class="main" v-for="item of schemeWithThemeList" :key="item.id">
      <p class="plan-title">{{ item.name }}</p>
      <div class="plan">
        <template v-for="scheme of item.schemes">
          <div class="plan-item">
            <SchemeItem :scheme="scheme"></SchemeItem>
          </div>
        </template>
        <!-- 解决 flex 布局最后一行问题 -->
        <div class="plan-item last-dom" v-for="item in 4"></div>
      </div>
    </div>
  </div>
  <Footer></Footer>
  <div v-if="isAdmin" class="to-admin">
    <NuxtLink to="/admin">
      <el-button type="primary"> 后台管理 </el-button>
    </NuxtLink>
  </div>
</template>

<style scoped lang="less">
.header {
  width: 100vw;
  height: 500px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  user-select: none;
  -webkit-user-select: none;
  .head {
    width: 1200px;
    margin: auto;
    color: #000000;
    .logo {
      margin: 0;
      padding: 20px 0px;
    }
    .title {
      margin: 0;
      font-size: 40px;
      padding: 60px 0px 10px 0px;
    }
    .info {
      margin: 0;
      font-size: 20px;
      color: #666666;
    }
    .btn {
      margin-top: 70px;
      width: 170px;
      height: 49px;
      border-radius: 2px;
      font-size: 20px;
      background: #0052d9;
      border: 1px solid #0052d9;
      color: #fff;
    }
    .el-button:hover {
      background: rgb(77, 134, 228);
    }
  }
}
.search {
  user-select: none;
  -webkit-user-select: none;
  width: 1200px;
  margin: 0 auto;
  margin-top: -55px;
  position: relative;
  z-index: 1;
  background: #ffffff;
  box-shadow: 0px 0px 35px 0px rgba(190, 201, 222, 0.4);
  border-radius: 2px;
  padding: 40px;
  box-sizing: border-box;
  .content {
    width: auto;
    display: flex;
    justify-content: space-between;
    .content-left {
      flex: 1;
      margin-right: 20px;
      background: #f5f8fd;
      display: flex;
      padding: 0px 20px;
      align-items: center;
      input {
        flex: 1;
        background-color: #f5f8fd;
        outline: none;
        height: 50px;
        border: none;
      }
    }
    .search-btn {
      width: 199px;
      height: 65px;
      font-size: 20px;
      color: #ffffff;
      background: #0052d9;
    }
    .el-button:hover {
      background: rgb(77, 134, 228);
    }
  }
  .advanced-search {
    margin-top: 30px;

    .advanced-search-item {
      margin-top: 8px;
      display: flex;
      align-items: baseline;
      .search-title {
        margin: 0;
        width: 100px;
        font-size: 14px;
        color: #959cad;
      }
      .item {
        flex: 1;
        margin: 0;
        span {
          margin: 0px 5px;
          padding: 3px 5px;
          font-size: 14px;
          cursor: pointer;
          white-space: pre;
          display: inline-block;
          margin-bottom: 12px;
        }
        .active {
          color: #fff;
          background-color: #0052d9;
          border-radius: 3px;
          padding: 3px 5px;
        }
      }
    }
  }
}
.scheme {
  user-select: none;
  -webkit-user-select: none;
  width: 1200px;
  margin: 0 auto;
  min-height: 800px;
  .main {
    margin-top: 30px;
    .plan-title {
      font-size: 24px;
      font-weight: 400;
      color: #000000;
      margin-bottom: 30px;
    }
    .plan {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .plan-item {
        width: 24%;
        cursor: pointer;
        border: 1px solid #eceff4;
        border-radius: 6px;
        margin-bottom: 15px;
        position: relative;
      }
      .last-dom {
        border: none;
        margin-bottom: 0px;
      }
    }
  }
}

.to-admin {
  width: 120px;
  height: 82px;
  color: #0052d9;
  cursor: pointer;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
