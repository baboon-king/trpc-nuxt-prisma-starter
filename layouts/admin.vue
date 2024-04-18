<template>
  <el-container>
    <el-header>
      <img src="~/assets/logo/icon.png" h-50px />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-active="defaultActive" router>
          <el-menu-item index="/admin">
            <el-icon><ElIconMenu /></el-icon>
            <span>应用管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/swiper">
            <el-icon><ElIconMenu /></el-icon>
            <span>轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/schemeTheme">
            <el-icon><ElIconMenu /></el-icon>
            <span>事项主题管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/suitableDepartment">
            <el-icon><ElIconMenu /></el-icon>
            <span>办理部门管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/suitableAudience">
            <el-icon><ElIconMenu /></el-icon>
            <span>办理对象管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/tag">
            <el-icon><ElIconMenu /></el-icon>
            <span>标签管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/area">
            <el-icon><ElIconMenu /></el-icon>
            <span>地区管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <NuxtPage />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth();

// 需要登录取消注释
// if (status.value === "unauthenticated") {
//   await signIn("identity-server4", {
//     callbackUrl: "/admin",
//   });
// }

const { currentRoute } = useRouter();

const defaultActive = ref<string>("");

onMounted(() => {
  defaultActive.value = currentRoute.value.path;
});
</script>

<style lang="less">
.el-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}
.el-menu {
  height: calc(100vh - 60px);
}

.el-main {
  height: calc(100vh - 60px);
  overflow: auto;
}
</style>
