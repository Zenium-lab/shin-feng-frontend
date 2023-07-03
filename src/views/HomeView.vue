<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import StatusIndicator from '@/components/StatusIndicator.vue';
import VideoCard from '@/components/VideoCard.vue';
import { reactive, ref, computed, onMounted } from 'vue';
import type { StatusInfo } from '@/types';
import * as API from '@/api';
import { Video, IPCam } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
const statusList: StatusInfo[] = reactive([
	{ icon: 'svgs/status/done.svg', statusName: '已完成', statusNumber: 0, color: 'bg-emerald-300' },
	{ icon: 'svgs/status/in-progress.svg', statusName: '處理中', statusNumber: 0, color: 'bg-yellow-300' },
	{ icon: 'svgs/status/canceled.svg', statusName: '已取消', statusNumber: 0, color: 'bg-gray-300' },
	{ icon: 'svgs/status/error.svg', statusName: '失敗', statusNumber: 0, color: 'bg-red-300' },
]);

const videoList = ref<Video[]>([]);
const ipcamList = ref<IPCam[]>([]);
const selectedIPCam = ref<IPCam>();
const statusCounts = ref<Record<string, number>>({});

// Loading
const isLoading = ref(false);

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
// TODO: 取得所有影片資訊
const getVideoList = async (): Promise<Video[]> => {
	try {
		const res = await API.getAllVideos();
		return res.data;
	} catch (error) {
		console.error(error);
		return [
			{
				start_time: 1405544146,
				updated_at: 1405544146,
				video_path: '',
				creator_id: 5,
				end_time: 1705544146,
				fps: 30,
				created_at: 1405544146,
				creator_name: 'Larry',
				id: 5,
				status: '已完成',
				first_snapshot_id: 1,
			},
			{
				start_time: 1405544146,
				updated_at: 1405544146,
				video_path: '',
				creator_id: 5,
				end_time: 1705544146,
				fps: 30,
				created_at: 1405544146,
				creator_name: 'Curry',
				id: 5,
				status: '發生錯誤',
				first_snapshot_id: 1,
			},
			{
				start_time: 1405544146,
				updated_at: 1405544146,
				video_path: '',
				creator_id: 5,
				end_time: 1705544146,
				fps: 30,
				created_at: 1405544146,
				creator_name: 'jerry',
				id: 5,
				status: '已取消',
				first_snapshot_id: 1,
			},
			{
				start_time: 1405544146,
				updated_at: 1405544146,
				video_path: '',
				creator_id: 5,
				end_time: 1705544146,
				fps: 30,
				created_at: 1405544146,
				creator_name: 'Sandy',
				id: 5,
				status: '處理中',
				first_snapshot_id: 1,
			},
			{
				start_time: 1405544146,
				updated_at: 1405544146,
				video_path: '',
				creator_id: 5,
				end_time: 1705544146,
				fps: 30,
				created_at: 1405544146,
				creator_name: 'Carrots',
				id: 5,
				status: '處理中',
				first_snapshot_id: 1,
			},
		];
	}
};

onMounted(async () => {
	isLoading.value = true;
	try {
		ipcamList.value = await getIPCamList();
		selectedIPCam.value = ipcamList.value[0];
		videoList.value = await getVideoList();

		// 統計每個狀態的數量
		statusCounts.value = videoList.value.reduce((counts, video) => {
			const status = video.status;
			counts[status] = (counts[status] || 0) + 1;
			return counts;
		}, {} as Record<string, number>);

		// 設定indicator
		statusList.forEach((status) => {
			status.statusNumber = statusCounts.value[status.statusName] || 0;
		});
	} catch (error) {
		console.error(error);
	}
	isLoading.value = false;
});
// 選擇的狀態
const selectedStatus = ref('');

// 選取狀態
const selectStatus = (status: string) => {
	selectedStatus.value = status;
};

// 過濾影片清單
const filteredVideoList = computed(() => {
	if (selectedStatus.value === '') {
		return videoList.value;
	} else {
		return videoList.value.filter((video) => video.status === selectedStatus.value);
	}
});
</script>

<template>
	<LoadingSpinner v-if="isLoading"></LoadingSpinner>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="col-span-1">
			<TitleSection title="影片瀏覽" subtitle="這裡會有所有的影片，包含正在剪輯中的影片" />
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
	<!-- Status Indicator -->
	<div class="mt-6 flex flex-row items-center justify-center gap-10 lg:flex-row">
		<StatusIndicator
			v-for="status in statusList"
			:key="status.statusName"
			:icon="status.icon"
			:statusName="status.statusName"
			:statusNumber="status.statusNumber"
			:color="status.color"
			:isSelected="status.statusName === selectedStatus"
			@click="selectStatus(status.statusName)"
		/>
	</div>
	<div class="mt-6 flex flex-col justify-center gap-10">
		<VideoCard v-for="video in filteredVideoList" :key="video.id" :video="video" />
	</div>
</template>
