<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import VideoMaker from '@/components/VideoMaker.vue';
import { computed, ref } from 'vue';
import { IPCam } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useIpcamStore } from '@/stores/ipcam';
import IpcamDropdown from '@/components/IpcamDropdown.vue';
// Loading
const isLoading = ref(false);

const ipcamStore = useIpcamStore();
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
			<TitleSection title="影片製作" subtitle="選擇時間，製作影片" />
		</div>
		<!-- 選擇 IPCam 的 dropdown -->
		<div class="col-span-1 flex items-center justify-center lg:justify-end">
			<IpcamDropdown />
		</div>
	</div>

	<!-- 影片製作 -->
	<VideoMaker :selected-i-p-cam="selectedIPCam!"></VideoMaker>
</template>
