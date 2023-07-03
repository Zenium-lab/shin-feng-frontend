<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import VideoMaker from '@/components/VideoMaker.vue';
import { onMounted, ref } from 'vue';
import { IPCam } from '@/api';
import * as API from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
// Loading
const isLoading = ref(false);
const ipcamList = ref<IPCam[]>([]);
const selectedIPCam = ref<IPCam>();
// TODO: 取得所有IPcam
const getIPCamList = async (): Promise<IPCam[]> => {
	try {
		const res = await API.listIPCams();
		return res.data;
	} catch (error) {
		console.error(error);
		return [
			{
				imei: 1,
				name: 'IPCam1',
			},
			{
				imei: 2,
				name: 'IPCam2',
			},
			{
				imei: 3,
				name: 'IPCam3',
			},
		];
	}
};
onMounted(async () => {
	try {
		isLoading.value = true;
		ipcamList.value = await getIPCamList();
		selectedIPCam.value = ipcamList.value[0];
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
				<select
					v-model="selectedIPCam"
					class="block w-full appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
				>
					<option disabled value="">請選擇 IPCam</option>
					<option v-for="ipcam in ipcamList" :key="ipcam.imei" :value="ipcam">{{ ipcam.name }}({{ ipcam.imei }})</option>
				</select>
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
