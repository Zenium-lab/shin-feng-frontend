<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import VideoMaker from '@/components/VideoMaker.vue';
import { onMounted, ref } from 'vue';
import { IPCam } from '@/api';
import { NSelect } from 'naive-ui';
import * as API from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
// Loading
const isLoading = ref(false);
const ipcamList = ref<IPCam[]>([]);
const selectedIPCam = ref<IPCam>();
// TODO: 取得所有IPcam
const getIPCamList = async () => {
	const res = await API.listIPCams();
	return res.data;
};
onMounted(async () => {
	try {
		isLoading.value = true;
		ipcamList.value = await getIPCamList();
		selectedIPCam.value = ipcamList.value[0] || '';
		isLoading.value = false;
	} catch (error) {
		isLoading.value = false;
		console.error(error);
	}
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
			<div class="relative inline-block w-64">
				<n-select
					v-model:value="selectedIPCam"
					:options="
						ipcamList.map((ipcam) => ({
							label: ipcam,
							value: ipcam,
						}))
					"
				/>
				<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
					<svg
						class="h-4 w-4 fill-current"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
					</svg>
				</div>
			</div>
		</div>
	</div>

	<!-- 影片製作 -->
	<VideoMaker :selected-i-p-cam="selectedIPCam!"></VideoMaker>
</template>
