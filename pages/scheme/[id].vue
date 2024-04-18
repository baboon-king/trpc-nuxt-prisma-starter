<template>
  <div class="scheme-detail">
    <NuxtLink to="/">
      <p class="logo">
        <img src="~/assets/logo/icon.png" h-50px />
      </p>
    </NuxtLink>
    <div v-if="scheme" class="detail">
      <div class="scheme">
        <p class="position"></p>
        <div class="scheme-info">
          <div class="scheme-info-left">
            <img class="w-100% h-100%" :src="scheme.backgroundTheme" />
            <p class="title">{{ scheme.title }}</p>
            <img class="scheme-main-image rounded-t-xl" :src="scheme.mainImage" />
          </div>
          <div class="scheme-info-right">
            <p class="title">{{ scheme.title }}</p>
            <p class="secondary-title">{{ scheme.subTitle }}</p>
            <p class="tags">
              <template v-for="tag of scheme.tags">
                <span class="tag" :style="{ color: tag.color, background: tag.background }">
                  {{ tag.name }}
                </span>
              </template>
            </p>
            <p class="info">
              <span class="type"> 服务对象 </span>
              <template v-for="item of scheme.suitableAudiences">
                <span class="item">{{ item.name }}</span>
              </template>
            </p>
            <p class="info">
              <span class="type"> 事项主题 </span>
              <template v-for="item of scheme.themes">
                <span class="item">{{ item.name }}</span>
              </template>
            </p>
            <p class="info">
              <span class="type"> 责任部门 </span>
              <template v-for="item of scheme.suitableDepartments">
                <span class="item">{{ item.name }}</span>
              </template>
            </p>
            <div class="price">
              <p>
                免费 <span v-if="scheme.price"> ¥{{ scheme.price }} </span>
              </p>
              <div>
                <el-badge :value="scheme.zan">
                  <img @click="handleZan" :src="zan" style="width: 22px" />
                </el-badge>
                <img @click="handleStar" :src="start" />
              </div>
            </div>
            <el-button class="btn" @click="downloadSchemeResource"> 下载 </el-button>
            <el-button v-if="scheme.enjoyAddress" class="btn enjoy-btn" @click="toEnjoyAddress"> 体验 </el-button>
            <el-dropdown
              v-if="scheme.purchases.length > 0"
              style="margin-left: 15px"
              trigger="hover"
              @command="toPurchasingAddress"
            >
              <el-button class="btn enjoy-btn purchase" @click="() => toPurchasingAddress()"> 采购 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="purchase of scheme.purchases" :command="purchase.address">
                    {{ purchase.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <WangeditorWc :content="scheme?.detail" />
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import start from "~/assets/img/star.png";
import zan from "~/assets/img/zan-fill.png";
import { SchemeZanInput } from "~/client";

const { $client } = useNuxtApp();

const { status, signIn } = useAuth();

const id = ref<SchemeZanInput>(useRoute().params.id as string);

const { data: scheme, refresh } = await $client.scheme.byId.useQuery(id.value);

const handleZan = () => {
  $client.scheme.zan.mutate(id.value);
  refresh();
};

const handleStar = () => {
  console.log(scheme.value?.star);
};

const downloadSchemeResource = async () => {
  // 需要登录取消注释
  // if (status.value === "unauthenticated") {
  //   await signIn("identity-server4", {
  //     callbackUrl: `/scheme/${scheme.value?.id}`,
  //   });
  //   return;
  // }
  window.open(scheme.value?.resource);
};

const toEnjoyAddress = () => {
  window.open(scheme.value?.enjoyAddress);
};

const toPurchasingAddress = (address?: string) => {
  if (address) {
    window.open(address);
    return;
  }
  window.open(scheme.value?.purchases[0].address);
};
</script>

<style scoped lang="less">
.scheme-detail {
  background: #f5f8fe;
  height: 100vh;
  overflow: auto;
  user-select: none;
  -webkit-user-select: none;
  .logo {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .detail {
    background-color: #fff;
    .scheme {
      width: 1200px;
      margin: 0 auto;
      .position {
        margin: 0;
        height: 60px;
        font-size: 14px;
        color: #333333;
        span {
          color: #3d7eff;
        }
      }
      .scheme-info {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding-bottom: 40px;
        .scheme-info-left {
          width: 45%;
          position: relative;
          .title {
            position: absolute;
            top: 35px;
            left: 10%;
            font-size: 42px;
            font-weight: 500;
            color: #0d5874;
          }
          .scheme-main-image {
            width: 80%;
            height: 237px;
            position: absolute;
            bottom: 0px;
            left: 50%;
            margin-left: -40%;
          }
        }
        .scheme-info-right {
          width: 52%;
          .title {
            font-size: 28px;
            font-weight: bold;
            color: #333333;
          }
          .secondary-title {
            font-size: 18px;
            font-weight: 400;
            color: #333333;
          }
          .tags {
            .tag {
              border-radius: 2px;
              font-size: 12px;
              font-weight: 300;
              padding: 1px 7px;
              margin-right: 5px;
            }
          }
          .info {
            font-size: 14px;
            font-weight: 400;
            color: #666666;
            margin-top: 5px;
            display: flex;
            .type {
              margin-right: 20px;
            }
            .item {
              font-size: 14px;
              margin-right: 10px;
              color: #333333;
            }
          }
          .price {
            padding: 0px 30px;
            margin-top: 15px;
            height: 105px;
            background: #f5f8fd;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-between;
            p {
              font-size: 30px;
              font-weight: 500;
              color: #0052d9;
              span {
                font-size: 18px;
                font-weight: 500;
                color: #666666;
                text-decoration: line-through;
                margin-left: 10px;
              }
            }
            div {
              width: 22%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img {
                cursor: pointer;
              }
            }
          }
          .btn {
            margin-top: 15px;
            width: 227px;
            height: 59px;
            background: #0052d9;
            border-radius: 2px;
            font-size: 18px;
            color: #ffffff;
            text-align: center;
            line-height: 59px;
          }
          .enjoy-btn {
            width: 120px;
            background: #67c23a;
          }
          .enjoy-btn:hover {
            background: #95d475 !important;
            border-color: #95d475;
          }
          .el-button:hover {
            background: rgb(77, 134, 228);
          }
          .purchase {
            outline: none !important;
          }
        }
      }
    }
  }
  .content {
    width: 1200px;
    min-height: 800px;
    margin: 0 auto;
    margin-bottom: 15px;
    padding: 0px 10px;
    margin-top: 20px;
    background-color: #fff;
  }
}
</style>
