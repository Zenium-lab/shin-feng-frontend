<template>
	<div class="= flex h-auto w-full flex-col items-center justify-start rounded-md border border-black border-opacity-10 lg:flex-row">
		<!-- 照片 -->
		<div class="flex w-full items-center justify-center gap-4 rounded-md p-4 lg:w-1/3">
			<div class="relative h-[150px] w-full bg-zinc-300 bg-opacity-50">
				<router-link :to="`/video/${props.video.id}`" class="video-card">
					<template v-if="thumbnailSrc === ''">
						<div class="h-full w-full animate-pulse rounded-lg bg-gray-400"></div>
					</template>
					<template v-else>
						<img :src="thumbnailSrc" alt="Description" class="absolute h-full w-full object-cover" />
					</template>
				</router-link>
			</div>
		</div>

		<!-- 主要內容 -->
		<div class="flex w-full flex-col items-start justify-start py-2 lg:w-2/3">
			<div class="flex w-full flex-col items-center justify-start md:flex-row lg:gap-10">
				<!-- 開始時間和結束時間 -->
				<div class="flex w-3/4 items-center justify-start gap-5">
					<div class="flex w-full flex-col items-center justify-center">
						<div class="flex items-center justify-center gap-2.5 rounded-lg bg-zinc-700 px-5 py-1">
							<div class="text-md font-semibold text-white">開始時間</div>
						</div>
						<div class="flex w-full items-center justify-center gap-2.5 rounded-lg px-3 py-1">
							<div class="px-4 py-2 text-center text-base font-normal text-black">{{ timestampToTime(props.video.start_time) }}</div>
						</div>
					</div>
					<div class="flex w-full flex-col items-center justify-center">
						<div class="flex items-center justify-center gap-2.5 rounded-lg bg-zinc-700 px-5 py-1">
							<div class="text-md font-semibold text-white">結束時間</div>
						</div>
						<div class="flex w-full items-center justify-center gap-2.5 rounded-lg px-3 py-1">
							<div class="px-4 py-2 text-center text-base font-normal text-black">{{ timestampToTime(props.video.end_time) }}</div>
						</div>
					</div>
				</div>
				<!-- 建立者和處理狀態 -->
				<div class="flex w-1/4 flex-col items-center justify-center gap-2 py-2">
					<div class="flex w-full flex-col items-center justify-between gap-1">
						<div class="text-md rounded-lg bg-zinc-200 px-5 py-1 font-medium leading-tight text-black">建立者</div>
						<div class="text-md font-medium leading-tight text-black">{{ props.video.creator_name }}</div>
					</div>
					<div class="flex w-full items-center justify-center gap-2.5">
						<div class="text-md font-normal leading-tight text-black text-opacity-50">{{ props.video.status }}</div>
					</div>
				</div>
			</div>
			<!-- 下載進度 -->
			<div v-if="props.video.status === '處理中'" class="flex w-full items-center justify-between px-6 py-1">
				<div class="grid w-3/4 grid-cols-4">
					<div class="col-span-3 h-6 rounded-lg bg-gray-200">
						<div class="h-full rounded-lg bg-yellow-300" :style="{ width: `${progress.progress}%` }"></div>
					</div>
					<button class="col-span-1 mx-4 rounded-lg bg-yellow-400 px-3 py-1 text-xs font-normal text-black hover:bg-yellow-500">取消</button>
				</div>
				<div class="ml-4 flex w-1/4 items-center justify-center gap-4">
					<div class="text-[1rem] font-normal leading-tight text-black">{{ progress.progress }}% 剩餘{{ formatTime(progress.remain) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import * as API from '@/api';
import type { Video, Progress } from '@/api';
import { timestampToTime } from '@/utils/date';
const props = defineProps({
	video: {
		type: Object as () => Video,
		required: true,
	},
});
const progress: Progress = reactive({
	progress: 0,
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
				if (progressMessage.progress === 100) {
					// TODO: emit event to update this video status
					websocket.close();
				}
			} catch (err: unknown) {
				console.error('websocket message parse error', err);
			}
		};
		websocket.onclose = (event) => {
			console.log(event);
			console.log('websocket disconnected');
		};
		websocket.onerror = (event) => {
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
</script>

<style scoped>
/* 可根據需要自定義樣式 */
</style>
