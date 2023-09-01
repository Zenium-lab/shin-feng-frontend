<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import StatusIndicator from '@/components/StatusIndicator.vue';
import VideoCard from '@/components/VideoCard.vue';
import { reactive, ref, computed, onMounted, watch } from 'vue';
import type { StatusInfo, Status } from '@/types';
import * as API from '@/api';
import { Video } from '@/api';
import type { IPCam } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { NModal, NCard, useMessage, NSelect } from 'naive-ui';
import { useIpcamStore } from '@/stores/ipcam';

const statusList: StatusInfo[] = reactive([
	{ icon: 'svgs/status/done.svg', statusName: '已完成', statusNumber: 0, color: 'bg-emerald-300', textColor: 'text-emerald-400' },
	{ icon: 'svgs/status/in-progress.svg', statusName: '處理中', statusNumber: 0, color: 'bg-yellow-300', textColor: 'text-yellow-400' },
	{ icon: 'svgs/status/canceled.svg', statusName: '已取消', statusNumber: 0, color: 'bg-gray-300', textColor: 'text-gray-400' },
	{ icon: 'svgs/status/error.svg', statusName: '發生錯誤', statusNumber: 0, color: 'bg-red-300', textColor: 'text-red-400' },
	{ icon: 'svgs/status/schedule.svg', statusName: '系統排程', statusNumber: 0, color: 'bg-blue-300', textColor: 'text-blue-400' },
]);
const message = useMessage();
const ipcamList = ref<IPCam[]>([]);
const statusCounts = ref<Record<string, number>>({});
const videoList = ref<Video[]>([]);
const ipcamStore = useIpcamStore();
const selectedIPCam = computed({
	get(): IPCam {
		return ipcamStore.ipcam || '';
	},
	set(newIPCam: IPCam) {
		ipcamStore.setIpcam(newIPCam);
	},
});

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

//
// 取得所有IPcam
const getIPCamList = async (): Promise<IPCam[]> => {
	try {
		const res = await API.listIPCams();
		return res.data || [];
	} catch (error) {
		console.error(error);
		return [];
	}
};

// 取得所有影片資訊
const getVideoList = async () => {
	const res = await API.getAllVideos();
	return res.data || [];
};

// 如果selectedIPCam改變，就重新取得videoList
watch(selectedIPCam, async (newIPCam, _) => {
	const allVideos = await getVideoList();
	videoList.value = allVideos.filter((video) => video.imei === newIPCam);
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
		let result = await getIPCamList();
		ipcamList.value = result || [];
		if (selectedIPCam.value === '' && ipcamList.value.length > 0) {
			selectedIPCam.value = ipcamList.value[0];
		}
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
const addIPCam = (imei: string) => {
	API.createIPCam(imei)
		.then(async (_) => {
			let result = await getIPCamList();
			ipcamList.value = result || [];
			ipcamStore.setIpcam(imei);
			ipcamInput.value = '';
			message.success('新增成功');
			showModal.value = false;
		})
		.catch((err) => {
			message.error('新增失敗');
			console.error(err);
		});
};
const showModal = ref(false);
const ipcamInput = ref('');
const handleDeleteIPCam = () => {
	if (selectedIPCam.value) {
		API.deleteIPCam(selectedIPCam.value)
			.then(async (_) => {
				let result = await getIPCamList();
				ipcamList.value = result || [];
				ipcamStore.setIpcam(ipcamList.value[0] || '');
				message.success('刪除成功');
			})
			.catch((err) => {
				if (err === '權限不足') {
					message.error('權限不足');
				} else {
					message.error('刪除失敗');
				}
			});
	}
};
</script>

<template>
	<LoadingSpinner v-if="isLoading"></LoadingSpinner>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="col-span-1">
			<TitleSection title="影片瀏覽" subtitle="這裡會有所有的影片，包含正在剪輯中的影片" />
		</div>
		<!-- 選擇 IPCam 的 dropdown -->
		<div class="col-span-1 flex items-center justify-center gap-3 lg:justify-end">
			<div class="relative inline-block w-64">
				<n-select
					v-model:value="selectedIPCam"
					:options="
						ipcamList.map((ipcam) => ({
							label: ipcam,
							value: ipcam,
						}))
					"
					clearable
					@clear="handleDeleteIPCam"
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
			<button
				@click="showModal = true"
				class="inline-flex items-center justify-center rounded-lg bg-zinc-200 px-4 py-2 font-normal text-black hover:bg-zinc-300"
			>
				新增
			</button>
			<n-modal v-model:show="showModal">
				<n-card style="width: 600px" title="新增 IP Camera (IMEI)" :bordered="false" size="huge" role="dialog" aria-modal="true">
					<template #header-extra> </template>
					<input
						v-model="ipcamInput"
						class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
						id="IPCam"
						type="text"
						placeholder="IPCam ex. 1234567890"
					/>

					<template #footer>
						<div class="flex justify-around">
							<button
								@click="addIPCam(ipcamInput)"
								class="py-2font-normal inline-flex items-center justify-center rounded-lg bg-green-200 px-4 text-black hover:bg-green-300"
							>
								確定
							</button>
							<button
								class="inline-flex items-center justify-center rounded-lg bg-red-200 px-4 py-2 font-normal text-black hover:bg-red-300"
								@click="showModal = false"
							>
								取消
							</button>
						</div>
					</template>
				</n-card>
			</n-modal>
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
