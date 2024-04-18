<template>
  <div>
    {{ status }}
  </div>
  <div>
    {{ data }}
  </div>

  <ElButton
    v-if="status === 'unauthenticated'"
    @click="
      signIn('identity-server4', {
        callbackUrl: '/login',
      })
    "
  >
    登录
  </ElButton>
  <ElButton @click="signOut()"> 退出 </ElButton>
</template>
<script setup lang="ts">
const { status, data, signIn, signOut } = useAuth();
</script>
