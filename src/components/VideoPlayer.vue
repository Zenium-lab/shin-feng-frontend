<template>
	<div class="container mx-auto px-4 py-5">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
			<div class="flex aspect-video items-center justify-center lg:col-span-2">
				<!-- 影片播放 iframe -->
				<template v-if="videoUrl">
					<video ref="videoPlayer" class="h-full w-full rounded-lg" :src="videoUrl" controls></video>
				</template>
				<template v-else>
					<!-- 顯示骨架屏或替代內容 -->
					<div class="h-full w-full animate-pulse rounded-lg bg-gray-300"></div>
					<!-- 或其他替代內容 -->
				</template>
			</div>
			<div class="grid grid-cols-1 items-center justify-center gap-2 text-center sm:grid-cols-2">
				<!-- 建立者 -->
				<div class="mx-5 rounded-md bg-gray-200 py-1 font-medium text-gray-800">建立者</div>
				<div class="font-medium text-black">{{ creator + videoId }}</div>
				<!-- 建立時間 -->
				<div class="mx-5 rounded-md bg-gray-200 py-1 font-medium text-gray-800">建立時間</div>
				<div class="font-medium text-black">{{ creationTime }}</div>
				<!-- 開始時間 -->
				<div class="mx-5 rounded-md bg-gray-200 py-1 font-medium text-gray-800">開始時間</div>
				<div class="font-medium text-black">{{ startTime }}</div>
				<!-- 結束時間 -->
				<div class="mx-5 rounded-md bg-gray-200 py-1 font-medium text-gray-800">結束時間</div>
				<div class="font-medium text-black">{{ endTime }}</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as API from '@/api';
import { timestampToTime } from '@/utils/date';
const route = useRoute();
const videoId = route.params.id as string;

// 取得該影片細節
const getVideoDetail = async () => {
	const res = await API.getVideoById(parseInt(videoId));
	const video = res.data;
	return {
		creator: video.creator_name,
		creationTime: timestampToTime(video.created_at),
		startTime: timestampToTime(video.start_time),
		endTime: timestampToTime(video.end_time),
	};
};
// 下載影片
const videoPlayer = ref(null);
let videoUrl = ref<string>();

const downloadVideoById = async (videoId: string) => {
	try {
		const video = await API.downloadVideoById(parseInt(videoId));
		// 设置Video元素的src属性为Blob URL
		videoUrl.value = URL.createObjectURL(video);
		// 释放URL资源
		URL.revokeObjectURL(videoUrl.value);
	} catch (error) {
		console.log(error);
		return '';
	}
};
const creator = ref();
const creationTime = ref();
const startTime = ref();
const endTime = ref();

onMounted(async () => {
	try {
		const videoDetail = await getVideoDetail();
		creator.value = videoDetail.creator;
		creationTime.value = videoDetail.creationTime;
		startTime.value = videoDetail.startTime;
		endTime.value = videoDetail.endTime;
		videoUrl.value = await downloadVideoById(videoId);
	} catch (error) {
		console.error(error);
	}
});
onUnmounted(() => {
	// 停止播放并清除URL资源
	if (videoUrl.value) {
		URL.revokeObjectURL(videoUrl.value);
	}
});
</script>
<style>
/* 自定義樣式 */
</style>
