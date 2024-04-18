<template>
  <div class="swiper">
    <el-button type="primary" @click="addSwiper">添加</el-button>
    <el-table :data="swiperList">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="副标题" prop="subTitle"></el-table-column>
      <el-table-column label="按钮文本" prop="btnText"></el-table-column>
      <el-table-column label="背景图">
        <template #default="{ row }">
          <img class="h-16 rounded" :src="row.image" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template #default="{ row }">
          <el-switch v-model="row.published" @change="handlePublished(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="140px">
        <template #default="{ row }">
          <el-button-group>
            <el-button text type="primary" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button text type="danger" @click="deleteSwiper(row.id)"> 删除 </el-button>
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
      <el-dialog v-model="dialogVisible" :title="title" @close="handleClose">
        <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="子标题" prop="subTitle">
            <el-input v-model="form.subTitle"></el-input>
          </el-form-item>
          <el-form-item label="按钮文本" prop="btnText">
            <el-input v-model="form.btnText"></el-input>
          </el-form-item>
          <el-form-item label="跳转地址" prop="target">
            <el-input v-model="form.target"></el-input>
          </el-form-item>
          <el-form-item label="背景图" prop="image">
            <el-input v-model="form.image"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from "element-plus";
import { Pager } from "trpc/pagination";

import { SwiperCreateOutput, SwiperUpdateInput } from "~/client";

definePageMeta({
  layout: "admin",
});
const { $client } = useNuxtApp();
const dialogVisible = ref(false);
const title = ref("添加轮播图");
const form = ref<SwiperUpdateInput>({
  id: "",
  title: "",
  image: "",
  subTitle: "",
  btnText: "",
  target: "",
});
const pager = ref<Pager>({
  index: 1,
  size: 10,
});
const total = ref<number>(10);
const swiperList = ref<SwiperCreateOutput[]>([]);
const isEdit = ref(false);
const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  subTitle: [{ required: true, message: "请输入副标题", trigger: "blur" }],
  btnText: [{ required: true, message: "请输入按钮文本", trigger: "blur" }],
  target: [{ required: true, message: "请输入跳转地址", trigger: "blur" }],
  image: [{ required: true, message: "请输入背景图", trigger: "blur" }],
});
const formRef = ref<FormInstance>();

const addSwiper = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

const save = async () => {
  const valid = await formRef.value?.validate();
  if (valid) {
    if (isEdit.value) {
      await $client.swiper.update.mutate(form.value).catch((err) => {
        ElMessage.error(err.message);
        throw new Error(err);
      });
    } else {
      await $client.swiper.create.mutate(form.value).catch((err) => {
        ElMessage.error(err.message);
        throw new Error(err);
      });
    }
    dialogVisible.value = false;
    await init();
  }
};

const init = async () => {
  const {
    data,
    pagination: { count },
  } = await $client.swiper.searchByPage.query({ pager: pager.value });
  swiperList.value = data;
  total.value = count;
};

const handleClose = () => {
  form.value = {
    id: "",
    title: "",
    image: "",
    subTitle: "",
    btnText: "",
    target: "",
  };
  init();
};

const handleEdit = (row: SwiperCreateOutput) => {
  form.value = row;
  isEdit.value = true;
  dialogVisible.value = true;
};

const deleteSwiper = (id: string) => {
  ElMessageBox.confirm(`确认要删除该轮播图吗？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $client.swiper.deleteByIds.mutate([id]).then(() => {
      init();
    });
  });
};

const currentChange = (index: number) => {
  pager.value.index = index;
  init();
};

const handlePublished = (row: SwiperCreateOutput) => {
  const { id, published } = row;
  $client.swiper.switchPublished.mutate({ id, published });
};

onMounted(() => {
  init();
});
</script>
