<template>
  <NuxtLink :to="`/scheme/${scheme.id}`">
    <img class="w-100%" :src="scheme.backgroundTheme" alt="" />
    <p class="plan-item-title">{{ scheme.title }}</p>
    <img class="plan-item-content rounded-t-lg" :src="scheme.mainImage" alt="" />
    <p class="plan-item-name">{{ scheme.subTitle }}</p>
    <p class="plan-item-tag">
      <template v-for="tag of scheme.tags" :key="tag.id">
        <span class="tag-item" :style="{ color: tag.color, background: tag.background }">
          {{ tag.name }}
        </span>
      </template>
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps(["scheme"]);
</script>

<style scoped lang="less">
.plan-item-title {
  margin: 5px 0px 0px 0px;
  position: absolute;
  top: 15px;
  left: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #131e64;
}
.plan-item-content {
  position: absolute;
  width: 85%;
  height: 133px;
  top: 61px;
  left: 50%;
  margin-left: -42.5%;
  -webkit-user-drag: none;
}
.plan-item-name {
  font-size: 14px;
  color: #333333;
  margin: 15px 0px 8px 20px;
}
.plan-item-tag {
  margin: 0px 0px 20px 20px;
  .tag-item {
    border-radius: 2px;
    font-size: 12px;
    font-weight: 300;
    padding: 1px 7px;
    margin-right: 5px;
  }
}
</style>
