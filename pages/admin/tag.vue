<template>
  <div class="tag">
    <el-button type="primary" @click="addTag">新建标签</el-button>
    <el-table :data="tags">
      <el-table-column label="名称" prop="name">
        <template #default="scope">
          <span
            class="inline-block rounded p-1 text-xs"
            :style="{
              color: scope.row.color,
              background: scope.row.background,
            }"
          >
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="字体颜色">
        <template #default="scope">
          <div :style="{ background: scope.row.color }" style="width: 20px; height: 20px; border-radius: 3px"></div>
        </template>
      </el-table-column>
      <el-table-column label="背景颜色">
        <template #default="scope">
          <div
            :style="{ background: scope.row.background }"
            style="width: 20px; height: 20px; border-radius: 3px"
          ></div>
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template #default="{ row }">
          <el-switch v-model="row.published" @change="updatePublished(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140px">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" text @click="editTag(row)"> 编辑 </el-button>
            <el-button type="danger" text @click="delTag(row)"> 删除 </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 flex justify-end">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pager.size"
        hide-on-single-page
        @current-change="currentChange"
      />
    </div>
    <client-only>
      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑标签' : '新建标签'" @close="handleClose">
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="字体颜色" prop="color">
            <el-color-picker v-model="form.color" />
          </el-form-item>
          <el-form-item label="背景颜色" prop="background">
            <el-color-picker v-model="form.background" />
          </el-form-item>
          <el-form-item>
            <el-button @click="save" type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { Pager } from "trpc/pagination";

import { TagCreateOutput, TagUpdateInput, TagUpdateOutput } from "~/client";

definePageMeta({
  layout: "admin",
});
const { $client } = useNuxtApp();
const tags = ref<TagCreateOutput[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const form = ref<TagUpdateInput>({
  id: "",
  name: "",
  color: "#3397FF",
  background: "#D8EAFE",
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入标签名称", trigger: "blur" }],
  color: [{ required: true, message: "请选择颜色", trigger: "change" }],
  background: [{ required: true, message: "请选择背景颜色", trigger: "change" }],
});
const formRef = ref<FormInstance>();
const pager = ref<Pager>({
  index: 1,
  size: 10,
});
const total = ref<number>(10);

const addTag = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

const save = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    if (isEdit.value) {
      await $client.tag.update.mutate(form.value).catch((err) => {
        ElMessage.error(err.message);
        throw new Error(err);
      });
    } else {
      await $client.tag.create.mutate(form.value).catch((err) => {
        ElMessage.error(err.message);
        throw new Error(err);
      });
    }
    dialogVisible.value = false;
  }
};

const init = async () => {
  const {
    data,
    pagination: { count },
  } = await $client.tag.searchByPage.query({ pager: pager.value });
  tags.value = data;
  total.value = count;
};

const delTag = (row: TagCreateOutput) => {
  ElMessageBox.confirm(`确认要删除 ${row.name} 标签吗？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $client.tag.deleteByIds.mutate([row.id]).then((res) => {
      init();
    });
  });
};

const editTag = (row: TagCreateOutput) => {
  form.value = row;
  dialogVisible.value = true;
  isEdit.value = true;
};

const handleClose = () => {
  form.value = {
    id: "",
    name: "",
    color: "#3397FF",
    background: "#D8EAFE",
  };
  init();
};

const updatePublished = (tag: TagUpdateOutput) => {
  const { id, published } = tag;
  $client.tag.switchPublished.mutate({ id, published });
};

const currentChange = (pageIndex: number) => {
  pager.value.index = pageIndex;
  init();
};

onMounted(() => {
  init();
});
</script>
