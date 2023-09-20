import { useAuthStore } from '@/stores/auth';
export const OnlyAdminCanDelete = () => {
	const authStore = useAuthStore();
	if (authStore.userRole !== '管理員') {
		return false;
	}
	return true;
};

export const OnlyEditorCanSchedule = () => {
	const authStore = useAuthStore();
	if (authStore.userRole !== '管理員' && authStore.userRole !== '編輯者') {
		return false;
	}
	return true;
};
