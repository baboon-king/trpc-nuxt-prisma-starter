<template>
  <el-button type="primary" @click="addSchemeTheme">添加办理部门</el-button>
  <el-table :data="suitableDepartment">
    <el-table-column label="办理部门名称" prop="name" />
    <el-table-column label="启用">
      <template #default="{ row }">
        <el-switch v-model="row.published" @change="() => handlePublished(row)"></el-switch>
      </template>
    </el-table-column>

    <el-table-column fixed="right" width="140px" label="操作">
      <template #default="{ row }">
        <el-button-group>
          <el-button type="primary" text @click="editSchemeTheme(row)"> 编辑 </el-button>
          <el-button type="danger" text @click="delSchemeTheme(row.id)"> 删除 </el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <client-only>
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
    <el-dialog v-model="dialogVisible" :title="title" @close="handleClose">
      <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";

import { SuitableDepartmentCreateOutput, SuitableDepartmentUpdateInput } from "~/client";

definePageMeta({
  layout: "admin",
});
const { $client } = useNuxtApp();
const suitableDepartment = ref<SuitableDepartmentCreateOutput[]>([]);
const isEdit = ref(false);
const title = ref<string>(isEdit.value ? "编辑办理部门" : "添加办理部门");
const dialogVisible = ref(false);
const form = ref<SuitableDepartmentUpdateInput>({
  name: "",
  id: "",
} satisfies SuitableDepartmentUpdateInput);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请填写办理部门名称", trigger: "blur" }],
});
const pager = ref({
  index: 1,
  size: 10,
});
const total = ref(10);

const init = async () => {
  const {
    data,
    pagination: { count },
  } = await $client.suitableDepartment.searchByPage.query({
    pager: pager.value,
  });
  suitableDepartment.value = data;
  total.value = count;
};

const addSchemeTheme = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

const save = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    if (isEdit.value) {
      await $client.suitableDepartment.update.mutate(form.value).catch((error) => {
        ElMessage.error(error.message);
        throw new Error(error);
      });
    } else {
      await $client.suitableDepartment.create.mutate(form.value).catch((error) => {
        ElMessage.error(error.message);
        throw new Error(error);
      });
    }
    dialogVisible.value = false;
  }
};

const handleClose = () => {
  form.value = {
    name: "",
    id: "",
  };
  init();
};

const handlePublished = (row: SuitableDepartmentCreateOutput) => {
  const { id, published } = row;
  $client.suitableDepartment.switchPublished.mutate({ id, published });
};

const editSchemeTheme = (row: SuitableDepartmentCreateOutput) => {
  isEdit.value = true;
  dialogVisible.value = true;
  form.value = row;
};

const delSchemeTheme = async (id: string) => {
  ElMessageBox.confirm(`确认要删除该办理部门吗？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $client.suitableDepartment.deleteByIds.mutate([id]).then(() => {
      init();
    });
  });
};

const currentChange = (pageIndex: number) => {
  pager.value.index = pageIndex;
  init();
};

onMounted(() => {
  init();
});
</script>

<style></style>
