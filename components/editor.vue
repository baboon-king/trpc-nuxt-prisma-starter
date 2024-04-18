<template>
  <div style="border: 1px solid #ccc; z-index: 1">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <WangEditor
      style="height: 500px; overflow-y: hidden"
      :default-content="props.content"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @customPaste="handleCustomPaste"
    />
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { Toolbar, Editor as WangEditor } from "@wangeditor/editor-for-vue";
import { Descendant } from "slate";
import { onBeforeUnmount, ref, shallowRef } from "vue";

const mode = ref("default");

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const emit = defineEmits(["update:content"]);
const props = withDefaults(defineProps<{ content: Descendant[] }>(), {});

const imageType = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const toolbarConfig: Partial<IToolbarConfig> = {};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customBrowseAndUpload(insertFn: Function) {
        const { accessPath } = await pickFileToUpload({
          description: "Image files",
          mimeTypes: imageType,
          extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        }).catch((error) => {
          ElMessage.error(error.message);
          throw new Error(error);
        });
        insertFn(accessPath, "", "");
      },
    },
  },
};

const handleCustomPaste = async (editor: IDomEditor, event: ClipboardEvent) => {
  const file = event.clipboardData?.files;

  if (!file?.length) {
    return;
  }

  event.preventDefault();

  const firstFile = file[0];

  const fileType = imageType.includes(firstFile.type) ? "image" : "link";

  const { accessPath } = await uploadFile(firstFile);
  editor.insertNode({
    type: "paragraph",
    children: [
      {
        url: accessPath,
        src: accessPath,
        href: accessPath,
        type: fileType,
        children: [{ text: firstFile.name }],
      },
    ],
  });
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleChange = (editor: { children: any }) => {
  emit("update:content", editor.children);
};
</script>

<style></style>
