// auth.ts
import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userId: Ref<number> = ref(0);
  const isAuthenticated: Ref<boolean> = ref(false);

  function login(): void {
    // 登入處理邏輯
    isAuthenticated.value = true;
  }

  function logout(): void {
    // 登出處理邏輯
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    userId,
    login,
    logout
  };
});