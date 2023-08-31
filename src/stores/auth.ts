import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserMeta, UserRole } from '@/api';
export const useAuthStore = defineStore(
	'auth',
	() => {
		const userId = ref<number>();
		const userName = ref<string>();
		const userRole = ref<UserRole>();
		const userAccount = ref<string>();
		const token = ref<string>();

		function login(_token: string, _user: UserMeta): void {
			userId.value = _user.id;
			userName.value = _user.name;
			userRole.value = _user.role;
			userAccount.value = _user.account;
			token.value = _token;
		}

		function logout(): void {
			userId.value = undefined;
			userName.value = undefined;
			userRole.value = undefined;
			userAccount.value = undefined;
			token.value = undefined;
		}

		return {
			userId,
			userName,
			userRole,
			userAccount,
			token,
			login,
			logout,
		};
	},
	{
		persist: true,
	}
);
