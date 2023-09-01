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
			<n-select
				v-model:value="selectedIPCam"
				:options="
					ipcamList.map((ipcam) => ({
						label: ipcam,
						value: ipcam,
					}))
				"
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
	</div>
	<!-- 圖片 -->
	<div class="mx-auto mt-8 max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
		<div v-if="downloadProgress !== 100 && downloadProgress !== 0" class="inline-flex h-96 w-full animate-pulse items-center justify-center">
			<n-progress type="circle" :percentage="downloadProgress" :offset-degree="180">
				<span class="text-lg" style="text-align: center">{{ downloadNum }}/{{ totalNum }}</span>
			</n-progress>
		</div>
		<a v-else-if="snapshots.length > 0" :href="snapshots[selectedIdx].path" target="_blank">
			<img class="h-96 w-full object-cover" :src="snapshots[selectedIdx].path" alt="縮時截圖載入中" />
		</a>
		<div v-else class="h-96 w-full animate-pulse bg-slate-200"></div>

		<div class="flex items-center justify-between p-4">
			<div class="flex flex-col">
				<h2 class="mb-2 text-xl font-semibold">{{ snapshots.length > 0 ? timestampToTime(snapshots[selectedIdx].created_at) : '尚無資料' }}</h2>
				<p class="text-gray-500">{{ snapshots.length > 0 ? snapshots[selectedIdx].ipcam_imei : 'no data' }}</p>
			</div>
			<div class="flex items-center justify-center gap-4">
				<button class="h-12 w-12 rounded-lg p-2 hover:bg-gray-200" @click="handleDownload">
					<img src="svgs/download.svg" alt="Account" class="h-full w-full" />
				</button>
				<button class="h-12 w-12 rounded-lg p-3 hover:bg-gray-200" @click="showModal = true">
					<img src="svgs/trashcan.svg" alt="Account" class="h-full w-full" />
				</button>
			</div>
		</div>
	</div>
	<!-- delete modal -->
	<n-modal v-model:show="showModal">
		<n-card style="width: 600px" title="重大更新確認" :bordered="false" size="huge" role="dialog" aria-modal="true">
			<template #header-extra> </template>
			<div class="text-lg font-semibold text-black">確定要刪除照片嗎？</div>
			<template #footer>
				<div class="flex justify-around">
					<button
						@click="handleDelete"
						class="inline-flex items-center justify-center rounded-lg bg-green-300 px-4 py-2 font-normal text-black hover:bg-green-800"
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
	<!-- 選擇開始日期、時間 -->
	<div class="mx-auto mt-4 max-w-3xl">
		<input
			v-model.number="selectedIdx"
			id="steps-range"
			type="range"
			min="0"
			:max="snapshots.length - 1"
			step="1"
			class="h-4 w-full cursor-pointer rounded-sm"
		/>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import TitleSection from '@/components/TitleSection.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getStartEndOfDate, timestampToTime } from '@/utils/date';
import * as API from '@/api';
import { useMessage, NSelect, NModal, NCard, NProgress } from 'naive-ui';
import { useIpcamStore } from '@/stores/ipcam';
import { IPCam } from '@/api';
const ipcamStore = useIpcamStore();
const message = useMessage();
const isLoading = ref(false);
const selectDate = ref('');
const selectedIdx = ref(0);

const ipcamList = ref<API.IPCam[]>([]);
const showModal = ref(false);

const selectedIPCam = computed({
	get(): IPCam {
		return ipcamStore.ipcam || '';
	},
	set(newIPCam: IPCam) {
		ipcamStore.setIpcam(newIPCam);
	},
});

onMounted(() => {
	API.listIPCams().then((res) => {
		ipcamList.value = res.data || [];
		if (selectedIPCam.value === '' && ipcamList.value.length > 0) {
			selectedIPCam.value = ipcamList.value[0];
		}
	});
});

// 如果selectedIPCam改變，就重新取得videoList
watch(selectedIPCam, async (newIPCam, oldIPCam) => {
	if (newIPCam !== oldIPCam) {
		// 清空snapshots, selectedIdx, selectDate
		snapshots.value = [];
		selectedIdx.value = 0;
		selectDate.value = '';
	}
});

const downloadProgress = ref(0);
const downloadNum = ref(0);
const totalNum = ref(0);
const snapshots = ref<API.Snapshot[]>([]);

let currentRequestId = 0; // 外部變數來跟踪最新的請求ID

const handleDate = () => {
	const { start, end } = getStartEndOfDate(selectDate.value);
	if (start > new Date()) {
		message.error('開始時間不可大於今天');
		selectDate.value = '';
		return;
	}

	const thisRequestId = Date.now(); // 生成唯一的請求ID
	currentRequestId = thisRequestId;

	let currentDownloadNum = 0;
	let currentTotalNum = 0;
	let currentDownloadProgress = 0;

	API.listSnapshotsInRange(selectedIPCam.value!, start.getTime() / 1000, end.getTime() / 1000)
		.then((res) => {
			if (!res || res.length === 0) {
				message.error('尚無資料');
				return;
			}
			currentTotalNum = res.length;

			const updateProgress = () => {
				currentDownloadNum++;
				currentDownloadProgress = (currentDownloadNum / currentTotalNum) * 100;

				// 僅當此請求是最新的請求時，才更新ref
				if (thisRequestId === currentRequestId) {
					downloadNum.value = currentDownloadNum;
					totalNum.value = currentTotalNum;
					downloadProgress.value = currentDownloadProgress;
				}
			};

			const downloadPromises = res.map((snapshot) => {
				return API.downloadSnapshotById(snapshot.id)
					.then((base64Img) => {
						snapshot.path = base64Img;
						updateProgress();
					})
					.catch((err) => {
						console.error(err);
						message.error('尚無資料');
					});
			});

			return Promise.all(downloadPromises).then(() => {
				snapshots.value = res;
			});
		})
		.catch((err) => {
			message.error('尚無資料');
			console.error(err);
		});
};

const handleDownload = () => {
	const a = document.createElement('a');
	if (snapshots.value.length === 0) {
		message.error('尚無資料');
		return;
	}
	a.href = snapshots.value[selectedIdx.value].path;
	a.download = `${timestampToTime(snapshots.value[selectedIdx.value].created_at)}.png`;
	a.click();
};
const handleDelete = () => {
	if (snapshots.value.length === 0) {
		message.error('尚無資料');
		return;
	}

	API.deleteSnapshotById(snapshots.value[selectedIdx.value].id)
		.then(() => {
			message.success('刪除成功');
			console.log(selectedIdx.value, snapshots.value.length);
			snapshots.value.splice(selectedIdx.value, 1);
			console.log(selectedIdx.value, snapshots.value.length);
			// 更新selectedIdx
			if (selectedIdx.value === snapshots.value.length) {
				selectedIdx.value = snapshots.value.length - 1;
			}
			console.log(selectedIdx.value, snapshots.value.length);
			console.log(typeof selectedIdx.value, typeof snapshots.value.length);
			console.log(selectedIdx.value === snapshots.value.length);
			showModal.value = false;
		})
		.catch((err) => {
			if (err === '權限不足') {
				message.error('權限不足');
			} else {
				message.error('刪除失敗');
			}
			showModal.value = false;
		});
};
</script>
<style scoped></style>
