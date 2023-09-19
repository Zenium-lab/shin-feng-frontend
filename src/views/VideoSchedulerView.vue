<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import VideoScheduler from '@/components/VideoScheduler.vue';
import { computed, ref } from 'vue';
import { IPCam } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useIpcamStore } from '@/stores/ipcam';
import IpcamDropdown from '@/components/IpcamDropdown.vue';
const ipcamStore = useIpcamStore();
// Loading
const isLoading = ref(false);
const selectedIPCam = computed({
	get(): IPCam {
		return ipcamStore.ipcam || '';
	},
	set(newIPCam: IPCam) {
		ipcamStore.setIpcam(newIPCam);
	},
});
</script>
<template>
	<LoadingSpinner v-if="isLoading"></LoadingSpinner>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="col-span-1">
			<TitleSection title="自動儲存" subtitle="定期自動儲存影片" />
		</div>
		<!-- 選擇 IPCam 的 dropdown -->
		<IpcamDropdown />
	</div>

	<!-- 影片製作 -->
	<VideoScheduler :ipcam="selectedIPCam!"></VideoScheduler>
</template>
