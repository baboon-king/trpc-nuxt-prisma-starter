<template>
  <WangEditor
    style="overflow-y: hidden"
    :default-content="content"
    :defaultConfig="{
      readOnly: true,
    }"
    mode="default"
  />
</template>

<script setup lang="ts">
import { Editor as WangEditor } from "@wangeditor/editor-for-vue";

const { content } = defineProps(["content"]);
</script>

<style>
@import "@wangeditor/editor/dist/css/style.css";
</style>
