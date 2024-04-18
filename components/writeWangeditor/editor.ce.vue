<template>
  <div style="border: 1px solid #ccc; z-index: 1">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <WangEditor
      style="height: 500px; overflow-y: hidden"
      :default-content="content"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @customPaste="handleCustomPaste"
    />
  </div>
</template>

<script setup lang="ts">
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { Toolbar, Editor as WangEditor } from "@wangeditor/editor-for-vue";
import { Descendant } from "slate";
import { onBeforeUnmount, ref, shallowRef } from "vue";

const ONE_MB = 1 * 1024 * 1024;
const ONE_MB_HALF = ONE_MB / 2;
const mode = ref("default");

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const emit = defineEmits(["change"]);
withDefaults(defineProps<{ content: Descendant[] }>(), {});

const imageType = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const toolbarConfig: Partial<IToolbarConfig> = {};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: ONE_MB_HALF,
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
  const files = event.clipboardData?.files;

  if (!files?.length) {
    return;
  }

  event.preventDefault();

  const firstFile = files[0];

  const fileType = imageType.includes(firstFile.type) ? "image" : "link";

  if (fileType === "image") {
    if (firstFile.length > ONE_MB_HALF) {
      ElMessage.warning(`图片不能大于 ${ONE_MB_HALF} KB`);
      return;
    }
  }

  const { accessPath } = await uploadFile(firstFile);
  editor.insertNode({
    src: accessPath,
    href: accessPath,
    type: fileType,
    children: [{ text: firstFile.name }],
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
  emit("change", JSON.parse(JSON.stringify(editor.children)), "test");
};
</script>

<style>
@import "@wangeditor/editor/dist/css/style.css";
</style>
