<template>
	<div class="container mx-auto px-4 py-5">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
			<div class="flex aspect-video items-center justify-center lg:col-span-2">
				<!-- 影片播放 iframe -->
				<iframe
					class="h-full w-full rounded-lg"
					src="https://www.youtube.com/embed/-aKwHCzINes"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const videoId = route.params.id;
// 將timestamp轉成日期格式
const timestampToDate = (timestamp: string) => {
	const date = new Date(parseInt(timestamp));
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};
// 取得該影片細節
const getVideoDetail = () => {
	return {
		creator: '新豐街主任',
		creationTime: timestampToDate('1687199420000'),
		startTime: timestampToDate('1687119420000'),
		endTime: timestampToDate('1687910100000'),
	};
};
const creator = ref();
const creationTime = ref();
const startTime = ref();
const endTime = ref();

onMounted(() => {
	const videoDetail = getVideoDetail();
	creator.value = videoDetail.creator;
	creationTime.value = videoDetail.creationTime;
	startTime.value = videoDetail.startTime;
	endTime.value = videoDetail.endTime;
});
</script>
<style>
/* 自定義樣式 */
</style>
