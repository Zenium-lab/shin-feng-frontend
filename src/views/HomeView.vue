<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import StatusIndicator from '@/components/StatusIndicator.vue';
import VideoCard from '@/components/VideoCard.vue';
import { reactive, ref, computed, onMounted, watch } from 'vue';
import type { StatusInfo, Status } from '@/types';
import * as API from '@/api';
import { Video } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useIpcamStore } from '@/stores/ipcam';
import IpcamDropdown from '@/components/IpcamDropdown.vue';

const statusList: StatusInfo[] = reactive([
	{ icon: 'svgs/status/done.svg', statusName: '已完成', statusNumber: 0, color: 'bg-emerald-300', textColor: 'text-emerald-400' },
	{ icon: 'svgs/status/in-progress.svg', statusName: '處理中', statusNumber: 0, color: 'bg-yellow-300', textColor: 'text-yellow-400' },
	{ icon: 'svgs/status/canceled.svg', statusName: '已取消', statusNumber: 0, color: 'bg-gray-300', textColor: 'text-gray-400' },
	{ icon: 'svgs/status/error.svg', statusName: '發生錯誤', statusNumber: 0, color: 'bg-red-300', textColor: 'text-red-400' },
	{ icon: 'svgs/status/schedule.svg', statusName: '系統排程', statusNumber: 0, color: 'bg-blue-300', textColor: 'text-blue-400' },
]);
const statusCounts = ref<Record<string, number>>({});
const videoList = ref<Video[]>([]);
const ipcamStore = useIpcamStore();
const selectedIPCam = ref(ipcamStore.ipcam || '');

// Update status
const updateStatus = (videoId: number, status: Status) => {
	const video = videoList.value.find((video) => video.id === videoId);
	if (video) {
		// 更新statusList
		let statusInfo = statusList.find((statusInfo) => statusInfo.statusName === status);
		if (statusInfo) {
			statusInfo.statusNumber = statusInfo.statusNumber + 1;
		}
		statusInfo = statusList.find((statusInfo) => statusInfo.statusName === video.status);
		if (statusInfo) {
			statusInfo.statusNumber = statusInfo.statusNumber - 1;
		}
		video.status = status;
		// 更新statusCounts
		statusCounts.value[status] = statusCounts.value[status] + 1;
	}
};

// Loading
const isLoading = ref(false);

// 取得所有影片資訊
const getVideoList = async () => {
	if (selectedIPCam.value === '') {
		return [];
	}
	const res = await API.getAllVideos(selectedIPCam.value);
	return res.data || [];
};

// 如果selectedIPCam改變，就重新取得videoList
watch(selectedIPCam, async (_) => {
	videoList.value = await getVideoList();
	// videoList.value = allVideos.filter((video) => video.imei === newIPCam);
});

// 如果videoList改變，就重新統計status
watch(videoList, (newVideoList, oldVideoList) => {
	if (newVideoList !== oldVideoList) {
		// 統計每個狀態的數量
		statusCounts.value = newVideoList.reduce((counts, video) => {
			const status = video.status;
			counts[status] = (counts[status] || 0) + 1;
			return counts;
		}, {} as Record<string, number>);
		// 設定indicator
		statusList.forEach((status) => {
			status.statusNumber = statusCounts.value[status.statusName] || 0;
		});
	}
});

onMounted(async () => {
	isLoading.value = true;
	try {
		const allVideos = await getVideoList();
		videoList.value = allVideos.filter((video) => video.imei === selectedIPCam.value);
	} catch (error) {
		console.error(error);
	}
	isLoading.value = false;
});

const refreshed = ref(false);
const refreshVideoList = async (ipcam: string, interval: number = 0) => {
	refreshed.value = false;
	// isLoading.value = true;
	if (interval > 0) {
		setTimeout(async () => {
			const allVideos = await getVideoList();
			videoList.value = allVideos.filter((video) => video.imei === ipcam);
			refreshed.value = true;
			isLoading.value = false;
		}, interval);
		return;
	}
	const allVideos = await getVideoList();
	videoList.value = allVideos.filter((video) => video.imei === ipcam);
	refreshed.value = true;
	// isLoading.value = false;
};
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
		<IpcamDropdown />
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
	<div class="mt-6 flex flex-col justify-center gap-5">
		<transition-group name="vcard">
			<VideoCard
				@refresh-video-list="(ipcam, interval?) => refreshVideoList(ipcam, interval)"
				@update-video-status="(videoId, status) => updateStatus(videoId, status)"
				v-for="video in filteredVideoList"
				:refreshed="refreshed"
				:key="video.id"
				:video="video"
				:color="statusList.find((statusInfo) => statusInfo.statusName === video.status)?.textColor || 'text-gray-300'"
			/>
		</transition-group>
	</div>
</template>
<style scoped>
.vcard-enter-active,
.vcard-leave-active {
	transition: all 0.3s ease;
}
.vcard-enter,
.vcard-leave-to {
	opacity: 0;
	transform: translateY(30px);
}
</style>
