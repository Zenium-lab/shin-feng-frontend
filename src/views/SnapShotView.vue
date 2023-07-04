<template>
	<LoadingSpinner v-if="isLoading"></LoadingSpinner>
	<div class="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
		<!-- 標題 -->
		<div class="col-span-1">
			<TitleSection title="畫面觀看" subtitle="選擇日期，觀看影片" />
		</div>
		<!-- 日期 -->
		<div class="col-span-1 w-full items-center gap-4">
			<label for="startDate" class="w-1/3 text-center text-lg font-medium text-gray-500">選擇日期</label>
			<div class="flex w-2/3 items-center gap-2">
				<input type="date" id="startDate" class="form-input" v-model="selectDate" @change="handleDate()" />
			</div>
		</div>
		<div class="relative col-span-1 inline-block w-64">
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
	<!-- 圖片 -->
	<div class="mx-auto mt-8 max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
		<img v-if="snapshots.length > 0" class="h-96 w-full object-cover" :src="snapshots[selectedIdx - 1].path" alt="Image" />
		<div v-else class="h-96 w-full animate-pulse bg-slate-200"></div>
		<div class="flex items-center justify-between p-4">
			<div class="flex flex-col">
				<h2 class="mb-2 text-xl font-semibold">{{ snapshots.length > 0 ? timestampToTime(snapshots[selectedIdx - 1].created_at) : '尚無資料' }}</h2>
				<p class="text-gray-500">{{ snapshots.length > 0 ? snapshots[selectedIdx - 1].ipcam_imei : 'no data' }}</p>
			</div>
			<button class="h-10 w-10 rounded-lg hover:bg-gray-200" @click="handleDownload" :disabled="!selectedIdx">
				<img src="svgs/download.svg" alt="Account" class="h-full w-full" />
			</button>
		</div>
	</div>

	<!-- 選擇開始日期、時間 -->
	<div class="mx-auto mt-4 max-w-3xl">
		<input
			v-model="selectedIdx"
			id="steps-range"
			type="range"
			min="1"
			:max="snapshots.length"
			step="1"
			class="h-4 w-full cursor-pointer rounded-sm"
		/>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TitleSection from '@/components/TitleSection.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getStartEndOfDate, timestampToTime } from '@/utils/date';
import * as API from '@/api';
const isLoading = ref(false);
const selectedIPCam = ref<API.IPCam>();
const selectDate = ref('');
const selectedIdx = ref(1);
const ipcamList = ref<API.IPCam[]>([]);

onMounted(() => {
	API.listIPCams().then((res) => {
		ipcamList.value = res.data;
		selectedIPCam.value = ipcamList.value[0];
	});
});
const snapshots = ref<API.Snapshot[]>([]);
const handleDate = () => {
	const { start, end } = getStartEndOfDate(selectDate.value);

	API.listSnapshotsInRange(selectedIPCam.value!.imei, start.getTime() / 1000, end.getTime() / 1000)
		.then((res) => {
			snapshots.value = res;

			snapshots.value.forEach((snapshot) => {
				API.downloadSnapshotById(snapshot.id)
					.then((base64Img) => {
						snapshot.path = base64Img;
					})
					.catch((err) => {
						console.error(err);
					});
			});
		})
		.catch((err) => {
			console.error(err);
		});
};
const handleDownload = () => {
	const a = document.createElement('a');
	a.href = snapshots.value[selectedIdx.value - 1].path;
	a.download = `${timestampToTime(snapshots.value[selectedIdx.value - 1].created_at)}.png`;
	a.click();
};
</script>
<style scoped></style>
