import { IPCam } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useIpcamStore = defineStore(
	'ipcam',
	() => {
		const ipcam = ref<IPCam>();

		function setIpcam(_ipcam: IPCam): void {
			ipcam.value = _ipcam;
		}
		function getIpcam(): IPCam | undefined {
			return ipcam.value;
		}

		return {
			ipcam,
			setIpcam,
			getIpcam,
		};
	},
	{
		persist: true,
	}
);
