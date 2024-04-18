<template>
  <el-table :data="data.data">
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="邮政编码" prop="code"></el-table-column>
    <el-table-column label="启用">
      <template #default="{ row }">
        <el-switch v-model="row.published" @change="updatePublished(row)"></el-switch>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { Pager } from "trpc/pagination";

definePageMeta({
  layout: "admin",
});
const { $client } = useNuxtApp();

const search = ref<{
  name: string;
  pager: Pager;
}>({
  name: "",
  pager: {
    index: 1,
    size: 50,
  },
});

const { data, refresh } = await $client.area.searchByPage.useQuery(computed(() => ({ ...search.value })));

const updatePublished = (row: (typeof data.value.data)[number]) => {
  const { id, published } = row;
  $client.area.switchPublished.mutate({ id, published });
};
</script>

<style></style>
