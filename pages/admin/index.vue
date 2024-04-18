<template>
  <div class="scheme">
    <el-button @click="addScheme" type="primary">添加应用</el-button>
    <el-table :data="data.data">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="副标题" prop="subTitle" />
      <el-table-column label="价格" prop="price" width="80" />
      <el-table-column label="封面" width="120">
        <template #default="{ row }">
          <img class="rounded w-100%" :src="row.mainImage" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="背景" width="120">
        <template #default="{ row }">
          <img class="rounded w-100%" :src="row.backgroundTheme" alt="" />
        </template>
      </el-table-column>
      <el-table-column label="事项主题">
        <template #default="{ row }">
          <template v-for="item of row.themes" :key="item.id">
            <el-tag class="mr-1">{{ item.name }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="办理部门">
        <template #default="{ row }">
          <template v-for="item of row.suitableDepartments" :key="item.id">
            <el-tag class="mr-1">{{ item.name }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="办理对象">
        <template #default="{ row }">
          <template v-for="item of row.suitableAudiences" :key="item.id">
            <el-tag class="mr-1">{{ item.name }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="标签">
        <template #default="{ row }">
          <template v-for="item of row.tags" :key="item.id">
            <span
              class="mr-1 inline-block rounded p-1 text-xs"
              :style="{
                color: item.color,
                background: item.background,
              }"
            >
              {{ item.name }}
            </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="启用" width="80">
        <template #default="{ row }">
          <el-switch v-model="row.published" @click="switchPublished(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200px" header-align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button text type="warning" @click="handlePreview(row.id)"> 预览 </el-button>
            <el-button text type="primary" @click="toEdit(row)"> 编辑 </el-button>
            <el-button text type="danger" @click="onDelete(row.id)"> 删除 </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="pager.index"
        background
        layout="prev, pager, next"
        :total="data.pagination.count"
        :page-size="pager.size"
        hide-on-single-page
      />
    </div>
    <ClientOnly>
      <el-dialog
        v-model="dialogVisible"
        title="新建应用"
        top="50px"
        destroy-on-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="refresh"
      >
        <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
          <el-form-item label="标题" prop="basic.title">
            <el-input v-model="form.basic.title" />
          </el-form-item>
          <el-form-item label="二级标题" prop="basic.subTitle">
            <el-input v-model="form.basic.subTitle" />
          </el-form-item>
          <el-form-item label="封面" prop="basic.mainImage">
            <div class="upload-content rounded" @click="onUpload">
              <img class="w-100%" v-if="form.basic.mainImage" :src="form.basic.mainImage" />
              <el-icon v-else>
                <ElIconPlus></ElIconPlus>
              </el-icon>
            </div>
          </el-form-item>
          <el-form-item label="背景图片" prop="basic.backgroundTheme">
            <el-select
              v-model="form.basic.backgroundTheme"
              popper-class="user-select-option"
              placeholder="请选择背景图片"
              style="width: 100%"
            >
              <template #prefix>
                <img v-if="form.basic.backgroundTheme" :src="form.basic.backgroundTheme" class="h-7 rounded" />
              </template>
              <el-option v-for="(value, key) of backgroundOptions" :label="value" :value="value">
                <template #default>
                  <img class="rounded" :src="value" style="height: 100px" />
                </template>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.basic.price" clearable />
          </el-form-item>
          <el-form-item label="事项主题" prop="relation.themeIds">
            <el-select v-model="form.relation.themeIds" filterable multiple placeholder="请选择" style="width: 100%">
              <el-option v-for="(item, index) in schemeThemeOptions" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="办理对象" prop="relation.suitableAudienceIds">
            <el-select
              v-model="form.relation.suitableAudienceIds"
              filterable
              multiple
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in suitableAudienceOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="办理部门" prop="relation.suitableDepartmentIds">
            <el-select
              v-model="form.relation.suitableDepartmentIds"
              filterable
              multiple
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in suitableDepartmentOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标签" prop="relation.tagIds">
            <el-select v-model="form.relation.tagIds" filterable multiple placeholder="请选择" style="width: 100%">
              <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="上传应用" prop="basic.resource">
            <el-input :model-value="form.basic.resource" disabled>
              <template #append>
                <el-button @click="httpRequestApp">上传</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="体验地址">
            <el-input v-model="form.basic.enjoyAddress"></el-input>
          </el-form-item>
          <el-form-item label="供应商">
            <el-button v-if="form.relation.purchases.length == 0" @click="addPurchases" type="primary">添加</el-button>
            <div style="width: 100%">
              <div
                v-for="(purchase, index) of form.relation.purchases"
                style="
                  width: 100%;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  padding: 3px;
                  padding-left: 10px;
                  margin-bottom: 10px;
                "
              >
                <p style="width: 100%" class="mb-1 flex">
                  <span class="w-14"> 网址： </span>
                  <el-input v-model="purchase.address"></el-input>
                </p>
                <p style="width: 100%" class="mb-1 flex">
                  <span class="inline-block w-14">名称：</span>
                  <el-input v-model="purchase.name"></el-input>
                </p>
                <p>
                  <span class="inline-block" style="width: 52px"> 区域： </span>
                  <el-select v-model="purchase.areaId">
                    <el-option
                      v-for="area of areaOptions"
                      :key="area.id"
                      :label="area.name"
                      :value="area.id"
                    ></el-option>
                  </el-select>
                  <el-button-group class="ml-20">
                    <el-button
                      v-if="index === form.relation.purchases.length - 1"
                      @click="addPurchases"
                      type="primary"
                      text
                    >
                      添加
                    </el-button>
                    <el-button type="danger" @click="form.relation.purchases.splice(index, 1)" text> 删除 </el-button>
                  </el-button-group>
                </p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="应用详情" prop="basic.detail">
            <WriteWangeditorWc v-model:content="form.basic.detail" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { refDefault } from "@vueuse/core";
import { FormInstance, FormRules } from "element-plus";

import {
  SchemeCreateInput,
  SchemeCreateOutput,
  SchemeSearchByPageInput,
  SchemeSearchByPageOutput,
  SchemeUpdateInput,
} from "~/client";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();

const onUpload = async () => {
  const { accessPath } = await pickFileToUpload({
    description: "Image files",
    mimeTypes: ["image/jpg", "image/png", "image/gif", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  }).catch((error) => {
    ElMessage.error(error.message);
    throw new Error(error);
  });
  form.value.basic.mainImage = accessPath;
};

const dialogVisible = ref(false);
const { data: suitableAudienceOptions } = await $client.suitableAudience.published.useQuery();
const { data: suitableDepartmentOptions } = await $client.suitableDepartment.published.useQuery();
const { data: areaOptions } = await $client.area.published.useQuery();
const { data: schemeThemeOptions } = await $client.schemeTheme.published.useQuery();
const { data: tagOptions } = await $client.tag.published.useQuery();

type SchemeModelWithForm = SchemeUpdateInput | SchemeCreateInput;

const defaultSchemeUpdateInput: SchemeModelWithForm = {
  basic: {
    id: "",
    title: "",
    subTitle: "",
    backgroundTheme: "",
    mainImage: "",
    price: "",
    resource: "",
    detail: "",
    enjoyAddress: "",
  },
  relation: {
    themeIds: [],
    suitableAudienceIds: [],
    suitableDepartmentIds: [],
    tagIds: [],
    purchases: [],
  },
};

const defaultSchemeUpdateInputRef = ref<SchemeModelWithForm | undefined>(defaultSchemeUpdateInput);

const form = refDefault(defaultSchemeUpdateInputRef, defaultSchemeUpdateInput);
const rules = ref<FormRules>({
  "basic.title": [
    { required: true, message: "请输入应用标题", trigger: "blur" },
    { min: 4, max: 119, message: "标题字数必须位于4-119之间", trigger: "blur" },
  ],
  "basic.subTitle": [{ required: true, message: "请输入应用子标题", trigger: "blur" }],
  "basic.backgroundTheme": [{ required: true, message: "请输入背景图片", trigger: "change" }],
  "basic.mainImage": [{ required: true, message: "请上传封面", trigger: "change" }],
  "relation.themeIds": [{ required: true, message: "请选择事项主题", trigger: "change" }],
  "relation.suitableAudienceIds": [{ required: true, message: "请选择办理对象", trigger: "change" }],
  "relation.suitableDepartmentIds": [{ required: true, message: "请选择办理部门", trigger: "change" }],
  "relation.tagIds": [{ required: true, message: "请选择应用标签", trigger: "change" }],
  "basic.detail": [{ required: true, message: "应用详情不能为空", trigger: "change" }],
  "basic.resource": [{ required: false, message: "应用必须上传", trigger: "change" }],
});

const formRef = ref<FormInstance>();

const isEdit = ref(false);

const backgroundOptions = import.meta.glob("~/assets/background/*.png", {
  as: "url",
  eager: true,
});

const addScheme = () => {
  isEdit.value = false;
  dialogVisible.value = true;
};

const save = async () => {
  const valid = await formRef.value?.validate();
  console.log("save", JSON.parse(JSON.stringify(form.value)));
  if (valid) {
    if (form.value.basic.price === "") {
      form.value.basic.price = undefined;
    }

    if (isEdit.value) {
      await $client.scheme.update.mutate(form.value as SchemeUpdateInput).catch((error) => {
        ElMessage.error(error.message);
        throw new Error(error);
      });
    } else {
      await $client.scheme.create.mutate(form.value).catch((error) => {
        ElMessage.error(error.message);
        throw new Error(error);
      });
    }
    dialogVisible.value = false;
  }
};
const search = ref<Omit<SchemeSearchByPageInput, "pager">>({
  title: "",
  subTitle: "",
});

const pager = ref({
  index: 1,
  size: 10,
});

const { data, refresh } = await $client.scheme.searchByPage.useQuery(
  computed(() => ({ ...search.value, pager: pager.value })),
  {
    watch: [unref(search), unref(pager)],
  },
);

const toEdit = (row: SchemeSearchByPageOutput["data"][number]) => {
  const {
    backgroundTheme,
    mainImage,
    price,
    subTitle,
    suitableAudiences,
    suitableDepartments,
    tags,
    id,
    themes,
    title,
    resource,
    detail,
    enjoyAddress,
    purchases,
  } = row;

  form.value = {
    basic: {
      id,
      title,
      subTitle,
      backgroundTheme,
      mainImage,
      price: price?.toString(),
      resource,
      detail,
      enjoyAddress,
    },
    relation: {
      themeIds: themes.map((item) => item.id),
      suitableAudienceIds: suitableAudiences.map((item) => item.id),
      suitableDepartmentIds: suitableDepartments.map((item) => item.id),
      tagIds: tags.map((item) => item.id),
      purchases: purchases as SchemeUpdateInput["relation"]["purchases"],
    },
  };
  console.log("form", JSON.parse(JSON.stringify(form.value)));
  dialogVisible.value = true;
  isEdit.value = true;
};

const onDelete = async (id: string) => {
  const confirm = await ElMessageBox.confirm(`确认要删除应用吗？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  });
  if (confirm) {
    await $client.scheme.deleteByIds.mutate([id]);
    refresh();
  }
};

const switchPublished = (row: SchemeCreateOutput) => {
  const { id, published } = row;
  $client.scheme.switchPublished.mutate({ id, published });
};

const httpRequestApp = async () => {
  const { accessPath } = await pickFileToUpload(
    {
      extensions: [".zip"],
    },
    {
      dir: "resource",
      type: UploadType.resource,
    },
  ).catch((error) => {
    ElMessage.error(error.message);
    throw new Error(error);
  });
  form.value.basic.resource = accessPath;
};

const handlePreview = (id: string) => {
  window.open(`/scheme/${id}`);
};

const addPurchases = () => {
  form.value.relation.purchases.push({
    name: "",
    address: "",
    areaId: "",
  });
};
</script>

<style lang="less">
.user-select-option {
  .el-select-dropdown__item {
    height: 100px;
    margin-bottom: 5px;
  }
}

.upload-content {
  width: 178px;
  height: 178px;
  border: 1px dashed #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-icon {
    font-size: 28px;
  }
}
.upload-content:hover {
  border-color: #409eff;
}

.scheme {
  .el-dialog__body {
    height: 85vh;
    overflow: auto;
  }
}
</style>
