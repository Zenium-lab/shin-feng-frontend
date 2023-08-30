<template>
	<div
		class="relative flex h-auto w-full flex-col items-center justify-start rounded-md border border-gray-100 border-opacity-10 py-2 shadow-md lg:flex-row"
	>
		<!-- 照片 -->
		<div class="flex max-h-80 w-full items-center justify-center gap-4 rounded-md lg:w-1/3">
			<div class="relative h-32 w-60 bg-zinc-300 bg-opacity-50">
				<router-link :to="`/video/${props.video.id}`" class="video-card">
					<template v-if="thumbnailSrc === ''">
						<div class="h-full w-full animate-pulse rounded-lg bg-gray-400"></div>
					</template>
					<template v-else>
						<img
							:src="thumbnailSrc"
							alt="Description"
							class="absolute h-full w-full object-cover hover:origin-bottom hover:-rotate-6 hover:transition-all"
						/>
					</template>
				</router-link>
			</div>
		</div>

		<!-- 主要內容 -->
		<div class="flex w-full flex-col items-start justify-center px-6 py-2 lg:w-2/3">
			<div class="flex w-full flex-col items-center justify-center md:flex-row lg:gap-10">
				<!-- 開始時間和結束時間 -->
				<div class="flex flex-col items-center justify-center gap-1">
					<div class="flex w-full items-center justify-center">
						<div class="flex items-center justify-center gap-2.5 rounded-lg bg-zinc-700 px-5 py-1">
							<div class="text-md font-semibold text-white">開始時間</div>
						</div>
						<div class="flex items-center justify-center gap-2.5 rounded-lg px-3 py-1">
							<div class="px-4 py-2 text-center text-base font-normal text-black">{{ timestampToTime(props.video.start_time) }}</div>
						</div>
					</div>
					<div class="flex items-center justify-center">
						<div class="flex items-center justify-center gap-2.5 rounded-lg bg-zinc-700 px-5 py-1">
							<div class="text-md font-semibold text-white">結束時間</div>
						</div>
						<div class="flex items-center justify-center gap-2.5 rounded-lg px-3 py-1">
							<div class="px-4 py-2 text-center text-base font-normal text-black">{{ timestampToTime(props.video.end_time) }}</div>
						</div>
					</div>
				</div>
				<!-- 建立者和處理狀態 -->
				<div class="flex flex-col items-center justify-center gap-4 py-2">
					<div class="flex w-full items-center justify-center gap-3">
						<div class="text-md rounded-lg bg-zinc-200 px-5 py-1 font-medium leading-tight text-black">建立者</div>
						<div class="text-md font-medium leading-tight text-black">{{ props.video.creator_id !== 0 ? props.video.creator_name : '系統' }}</div>
					</div>
					<div class="text-md font-normal text-black text-opacity-50">{{ timestampToTime(props.video.created_at) }}</div>
					<!-- <div class="text-md font-normal text-black text-opacity-50">{{ props.video.status }}</div> -->
				</div>
			</div>
			<!-- 下載進度 -->
			<div
				v-if="props.video.status === '處理中' && progress.type === '下載中'"
				class="grid w-full grid-cols-2 items-center justify-between gap-2 px-6 py-1 sm:grid-cols-3"
			>
				<div class="col-span-2 grid grid-cols-4">
					<div class="col-span-3 h-6 rounded-lg bg-gray-200">
						<div class="h-full rounded-lg bg-yellow-300" :style="{ width: `${progress.progress}%` }"></div>
					</div>
					<button
						class="col-span-1 mx-4 inline-flex items-center justify-center rounded-lg px-1 py-1 text-xs font-normal text-black hover:bg-yellow-200"
						@click="handleCancelCreateVideo"
					>
						<img src="svgs/trash-yellow.svg" alt="圖標" class="h-4 w-4" />
					</button>
				</div>
				<div class="col-span-2 flex items-center justify-center gap-4 sm:col-span-1">
					<div class="text-[1rem] font-normal leading-tight text-black">{{ progress.progress }}%</div>
					<n-spin :size="20" />
					<div class="text-[0.9rem]">{{ progress.type }}</div>
				</div>
			</div>
			<div
				v-if="props.video.status === '處理中' && progress.type === '製作中'"
				class="grid w-full grid-cols-2 items-center justify-between gap-2 px-6 py-1 sm:grid-cols-3"
			>
				<div class="col-span-2 grid grid-cols-4">
					<div class="col-span-3 h-6 rounded-lg bg-gray-200">
						<div class="h-full rounded-lg bg-yellow-300" :style="{ width: `${progress.progress}%` }"></div>
					</div>
					<button
						class="col-span-1 mx-4 inline-flex items-center justify-center rounded-lg bg-yellow-400 px-3 py-1 text-xs font-normal text-black hover:bg-yellow-500"
						@click="handleCancelCreateVideo"
					>
						取消
					</button>
				</div>
				<div class="col-span-2 flex items-center justify-center gap-4 sm:col-span-1">
					<div class="inline-flex justify-between gap-2 text-[1rem] font-normal leading-tight text-black">
						{{ progress.progress }}% <span class="text-zinc-500"> 剩餘 </span> {{ formatTime(progress.remain) }}
					</div>
					<div class="text-[0.9rem] font-semibold text-green-500">{{ progress.type }}</div>
				</div>
			</div>
		</div>
		<!-- 處理狀態標籤 -->
		<div class="absolute bottom-0 right-3 flex flex-col items-center justify-center gap-4 py-2 text-xs">
			<div :class="['text-md rounded-lg p-1 font-medium leading-tight', props.color]">{{ props.video.status }}</div>
		</div>
		<!-- delete icon button -->
		<button class="absolute right-0 top-0 mr-6 rounded-lg p-2 hover:animate-bounce hover:bg-red-200" @click="showModal = true">
			<img src="svgs/trash.svg" alt="圖標" class="h-3 w-3" />
		</button>
		<!-- delete modal -->
		<n-modal v-model:show="showModal">
			<n-card style="width: 600px" title="重大更新確認" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<template #header-extra> </template>
				<div class="text-lg font-semibold text-black">確定要刪除影片嗎？</div>
				<template #footer>
					<div class="flex justify-around">
						<button
							@click="handleDeleteVideo"
							class="py-2font-normal text-ㄏㄜ inline-flex items-center justify-center rounded-lg bg-green-300 px-4 hover:bg-green-800"
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
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { NSpin, useMessage, NModal, NCard } from 'naive-ui';
import * as API from '@/api';
import type { Video, Progress } from '@/api';
import { timestampToTime } from '@/utils/date';
const emit = defineEmits(['updateVideoStatus', 'refreshVideoList']);
const showModal = ref(false);
const message = useMessage();
const props = defineProps({
	video: {
		type: Object as () => Video,
		required: true,
	},
	color: {
		type: String,
		default: 'text-gray',
	},
});
const progress: Progress = reactive({
	progress: 0,
	type: '下載中',
	elapsed: 0,
	remain: 0,
	videoId: props.video.id,
});

const formatTime = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	const formattedHours = hours.toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');
	const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

// 如果現在狀態是處理中，定期使用websocket拿progress
let websocket: WebSocket;
if (props.video.status === '處理中') {
	try {
		const websocket = API.getVideoProgress(props.video.id);
		websocket.onopen = () => {
			console.log('websocket connected');
		};
		websocket.onmessage = (event) => {
			try {
				const progressMessage: Progress = JSON.parse(event.data);
				if (progressMessage.videoId === props.video.id) {
					// 更新進度
					progress.progress = progressMessage.progress;
					progress.elapsed = progressMessage.elapsed;
					progress.remain = progressMessage.remain;
				}
				if (progressMessage.progress === 100 && progressMessage.type === '下載中') {
					emit('refreshVideoList', props.video.imei);
				}
				if (progressMessage.progress === 100 && progressMessage.type === '製作中') {
					emit('refreshVideoList', props.video.imei);
					websocket.close();
				}
			} catch (err: unknown) {
				emit('refreshVideoList', props.video.imei);
				console.error('websocket message parse error', err);
			}
		};
		websocket.onclose = (_) => {
			emit('refreshVideoList', props.video.imei);
			console.log('websocket disconnected');
		};
		websocket.onerror = (event) => {
			emit('refreshVideoList', props.video.imei);
			console.error(event);
		};
	} catch (err: unknown) {
		console.error(err);
	}
}
onUnmounted(() => {
	if (websocket) websocket.close();
});

// 縮圖載入
const thumbnailSrc = ref('');
onMounted(async () => {
	try {
		if (!props.video.first_snapshot_id) return;
		const res = await getThumbnailById(props.video.first_snapshot_id);
		thumbnailSrc.value = res;
	} catch (error) {
		console.error(error);
	}
});

const getThumbnailById = async (snapshotId: number): Promise<string> => {
	try {
		const res = await API.downloadThumbnailById(snapshotId);
		return URL.createObjectURL(res);
	} catch (error) {
		console.error(error);
		return '';
	}
};
// 刪除影片
const handleDeleteVideo = async () => {
	try {
		await API.deleteVideo(props.video.id);
		showModal.value = false;
		message.success('刪除成功');
		emit('refreshVideoList', props.video.imei);
	} catch (error) {
		console.error(error);
		emit('refreshVideoList', props.video.imei);
		message.error('刪除失敗');
	}
};
const handleCancelCreateVideo = async () => {
	try {
		await API.cancelCreateVideo(props.video.id);
		message.success('取消成功');
		emit('refreshVideoList', props.video.imei);
	} catch (error) {
		console.error(error);
		emit('refreshVideoList', props.video.imei);
		message.error('取消失敗');
	}
};
</script>

<style scoped>
/* 可根據需要自定義樣式 */
</style>
