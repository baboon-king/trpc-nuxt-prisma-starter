<template>
  <wangeditor-preview :content="content" />
</template>

<script setup lang="ts">
import { defineCustomElement } from "vue";

import Editor from "./editor.ce.vue";

const Element = defineCustomElement(Editor);

if (!customElements.get("wangeditor-preview")) {
  customElements.define("wangeditor-preview", Element);
}

const { content } = defineProps(["content"]);
</script>
