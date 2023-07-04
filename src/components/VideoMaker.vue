<template>
	<div class="container mx-auto px-4 py-5">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-10">
			<!-- 左半區域 -->
			<div class="col-span-2 flex items-center justify-center px-4">
				<!-- 縮圖或骨架載入 -->
				<template v-if="imageLoading">
					<div class="h-[400px] w-full animate-pulse rounded-lg bg-gray-400"></div>
				</template>
				<template v-else>
					<img :src="thumbnailSrc" alt="縮圖" class="h-[300px] w-full rounded-lg object-cover" />
				</template>
			</div>
			<!-- 右半區域 -->
			<div class="col-span-2 grid grid-cols-1 justify-around gap-4 lg:grid-cols-3">
				<!-- 表單 -->
				<form class="col-span-2 flex w-full flex-col gap-4">
					<!-- 選擇開始日期、時間 -->
					<div class="flex w-full items-center gap-4">
						<label for="startDate" class="w-1/3 text-center text-lg font-medium text-gray-500">開始日期</label>
						<div class="flex w-2/3 items-center gap-2">
							<input type="date" id="startDate" class="form-input" v-model="startDate" />
							<input type="time" id="startTime" class="form-input" v-model="startTime" />
						</div>
					</div>
					<!-- 選擇結束日期、時間 -->
					<div class="flex items-center gap-4">
						<label for="endDate" class="w-1/3 text-center text-lg font-medium text-gray-500">結束日期</label>
						<div class="flex w-2/3 items-center gap-2">
							<input type="date" id="endDate" class="form-input" v-model="endDate" />
							<input type="time" id="endTime" class="form-input" v-model="endTime" />
						</div>
					</div>
					<!-- 選擇每秒播放張數 -->
					<div class="flex items-center gap-4">
						<label for="frameRate" class="w-1/3 text-center text-lg font-medium text-gray-500">每秒播放張數</label>
						<select id="frameRate" class="form-select" v-model="frameRate">
							<option v-for="rate in frameRates" :key="rate" :value="rate">{{ rate }}</option>
						</select>
					</div>
					<!-- 選擇抽取張數比例 -->
					<div class="flex items-center gap-4">
						<label for="frameRatio" class="w-1/3 text-center text-lg font-medium text-gray-500">抽取張數比例</label>
						<select id="frameRatio" class="form-select" v-model="frameRatio">
							<option v-for="ratio in frameRatios" :key="ratio" :value="ratio">{{ ratio }}</option>
						</select>
					</div>
				</form>
				<div class="col-span-1 flex flex-col justify-end gap-6">
					<!-- 製作進度提示 -->
					<div v-if="downloading" class="flex w-full flex-col items-center justify-center gap-4">
						<div class="rounded-lg bg-gray-600 px-2 py-1 text-lg text-gray-50">fps = 每秒播放張數/抽取張數比例</div>
						<div class="text-justify text-lg text-gray-500">影片製作耗時，您可以隨時離開此頁面，製作將會在背景進行。</div>
						<div class="text-justify text-lg text-gray-500">
							如需察看進度，請至
							<router-link to="/"
								><button class="rounded-md bg-gray-200 px-1 text-black hover:bg-gray-600 hover:text-white">#影片瀏覽</button></router-link
							>
							。
						</div>
					</div>
					<!-- 製作影片按鈕 -->
					<button class="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-800" @click="makeVideo">製作影片</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import * as API from '@/api';
import { timeToTimestamp } from '@/utils/date';
import type { IPCam } from '@/api';
import { useAuthStore } from '@/stores/auth';
import { useMessage } from 'naive-ui';
const message = useMessage();
const authStore = useAuthStore();
const props = defineProps({
	selectedIPCam: {
		type: Object as () => IPCam,
		required: true,
	},
});

// 影片資訊
const thumbnailSrc = ref('縮圖路徑');
const imageLoading = ref(true);
const downloading = ref(true);

// 表單資料
const startDate = ref('');
const startTime = ref('');
const endDate = ref('');
const endTime = ref('');
const frameRate = ref(5);
const frameRatio = ref(1);

// 觀察選擇的開始日期，若有改變則載入圖片
watch([startDate, startTime, endDate, endTime], () => {
	if (startDate.value && startTime.value && endDate.value && endTime.value) {
		const startTs = timeToTimestamp(startDate.value, startTime.value);
		const endTs = timeToTimestamp(endDate.value, endTime.value);
		if (startTs >= endTs) {
			message.error('開始時間不可大於結束時間');
			return;
		}
		API.listSnapshotsInRange(props.selectedIPCam.imei, startTs, endTs)
			.then((res) => {
				if (!res || res.length === 0) {
					message.error('尚無資料');
					return;
				}
				API.downloadSnapshotById(res[0].id)
					.then((base64Img) => {
						thumbnailSrc.value = base64Img;
						imageLoading.value = false;
					})
					.catch((err) => {
						message.error('預覽圖下載失敗');
						console.error(err);
					});
			})
			.catch((err) => {
				message.error('尚無資料');
				console.error(err);
			});
	}
});

// TODO: 開始製作影片
const makeVideo = () => {
	if (startDate.value === '' || startTime.value === '' || endDate.value === '' || endTime.value === '') {
		message.error('請選擇開始時間與結束時間');
		return;
	}
	const startTs = timeToTimestamp(startDate.value, startTime.value);
	const endTs = timeToTimestamp(endDate.value, endTime.value);
	// alert(`Make Video\nstart: ${startTs}\nend ${endTs}\nframeRate: ${frameRate.value}\nframeRatio: ${frameRatio.value}`);
	API.createVideo({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		creator_id: authStore.userId!,
		start_time: startTs,
		end_time: endTs,
		fps: frameRate.value / frameRatio.value,
		imei: props.selectedIPCam.imei,
	});
	message.info('影片製作中，請稍後至 #影片瀏覽 頁面查看');
};

// 選項列表
const frameRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const frameRatios = [1, 2, 4, 8, 16, 32];
</script>

<style>
/* 自定義樣式 */
.form-input {
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	padding: 0.5rem;
	color: #4b5563;
}
.form-select {
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	padding: 0.5rem 2rem 0.5rem 0.75rem;
	font-size: 1rem;
	line-height: 1.5;
	color: #374151;
	appearance: none;
	background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%234B5563%"><path fill-rule="evenodd" d="M10 15a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 15z" clip-rule="evenodd"/></svg>');
	background-repeat: no-repeat;
	background-position: right 0.5rem center;
	background-size: 1.5em;
}
</style>
