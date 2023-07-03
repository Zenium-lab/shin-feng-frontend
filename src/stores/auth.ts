import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserMeta } from '@/api'
export const useAuthStore = defineStore('auth', () => {
  const userId = ref<number>();
  const userName = ref<string>();
  const userRole = ref<string>();
  const userAccount = ref<string>();
  const token = ref<string>();

  function login(_token: string, _user: UserMeta): void {
    // 登录处理逻辑
    userId.value = _user.id;
    userName.value = _user.name;
    userRole.value = _user.role;
    userAccount.value = _user.account;
    // 存储 token
    token.value = _token;
  }

  function logout(): void {
    // 登出处理逻辑
    userId.value = undefined;
    userName.value = undefined
    userRole.value = undefined
    userAccount.value = undefined
    // 清除 token
    token.value = undefined
  }

  return {
    userId,
    userName,
    userRole,
    userAccount,
    token,
    login,
    logout
  };
});