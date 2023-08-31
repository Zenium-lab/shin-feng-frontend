import { useAuthStore } from '@/stores/auth';
export const OnlyAdminCanDelete = () => {
	const authStore = useAuthStore();
	if (authStore.userRole !== '管理員') {
		return false;
	}
	return true;
};
