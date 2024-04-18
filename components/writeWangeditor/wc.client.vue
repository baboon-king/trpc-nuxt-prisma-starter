<template>
  <wangeditor-preview :content="contentRef" @change="change" />
</template>

<script setup lang="ts">
import { defineCustomElement } from "vue";

import Editor from "./editor.ce.vue";

const Element = defineCustomElement(Editor);

if (!customElements.get("wangeditor-preview")) {
  customElements.define("wangeditor-preview", Element);
}

const props = defineProps(["content"]);

const contentRef = useModel(props, "content");

const change = (event: any) => {
  const [content] = event.detail;
  contentRef.value = content;
};
</script>
