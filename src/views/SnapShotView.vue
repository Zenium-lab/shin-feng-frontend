<template>
	<LoadingSpinner v-if="isLoading"></LoadingSpinner>
	<!-- 標題 -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<div class="col-span-1">
			<TitleSection title="畫面觀看" subtitle="選擇日期，觀看影片" />
		</div>
		<!-- 選擇 IPCam 的 dropdown -->
		<div class="col-span-1 flex items-center justify-center lg:justify-end">
			<IpcamDropdown />
		</div>
	</div>
	<!-- 日期 -->
	<div class="flex items-center justify-center gap-4">
		<label for="startDate" class="text-center text-lg font-medium text-gray-500">請選擇日期</label>
		<div class="">
			<input type="date" id="startDate" class="form-input" v-model="selectDate" @change="handleDate()" />
		</div>
	</div>
	<!-- 圖片 -->
	<div class="mx-auto mt-8 max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg">
		<a v-if="snapshots.length > 0 && snapshots[selectedIdx].image_path" :href="snapshots[selectedIdx].image_path" target="_blank">
			<img class="h-96 w-full object-cover" :src="snapshots[selectedIdx].image_path" alt="縮時截圖載入中" />
		</a>
		<div v-else class="h-96 w-full animate-pulse bg-slate-400"></div>

		<div class="flex items-center justify-between p-4">
			<div class="flex flex-col">
				<h2 class="mb-2 text-xl font-semibold">{{ snapshots.length > 0 ? timestampToTime(snapshots[selectedIdx].created_at) : '尚無資料' }}</h2>
				<p class="text-gray-500">{{ snapshots.length > 0 ? snapshots[selectedIdx].imei : 'no data' }}</p>
			</div>
			<n-statistic v-if="snapshots.length !== 0" label="照片數量" :value="selectedIdx + 1">
				<template #prefix> </template>
				<template #suffix> / {{ snapshots.length }} </template>
			</n-statistic>
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
	<!-- 選擇圖片index -->
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
import { useMessage, NModal, NCard, NStatistic } from 'naive-ui';
import { useIpcamStore } from '@/stores/ipcam';
import { IPCam } from '@/api';
import debounce from 'lodash.debounce';
import IpcamDropdown from '@/components/IpcamDropdown.vue';

const ipcamStore = useIpcamStore();
const message = useMessage();
const isLoading = ref(false);
const selectDate = ref('');
const selectedIdx = ref(0);

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
	// 刷新日期
	resetDate();
});

// 如果selectedIPCam改變，就重新取得videoList
watch(selectedIPCam, async (newIPCam, oldIPCam) => {
	if (newIPCam !== oldIPCam) {
		// 清空snapshots, selectedIdx, selectDate
		snapshots.value = [];
		selectedIdx.value = 0;
		resetDate();
	}
});
const downloadSnapshotById = (id: number) => {
	if (snapshots.value.length > 0) {
		return API.downloadSnapshotById(snapshots.value[id].id)
			.then((base64Img) => {
				snapshots.value[id].image_path = base64Img;
			})
			.catch((err) => {
				console.error(err);
				message.error('尚無資料');
			});
	}
	return Promise.resolve();
};

// Reset selectedDate to today
const resetDate = () => {
	const today = new Date();
	const year = today.getFullYear();

	// 如果月份或日期是單一數字，將其格式化為兩位數
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const date = today.getDate().toString().padStart(2, '0');

	selectDate.value = `${year}-${month}-${date}`;
};

// 声明一个 debounce 函数
const debouncedFunction = debounce(async (newIdxDate: [number, string], oldIdxDate: [number, string]) => {
	const [_, oldDate] = oldIdxDate;
	const [newIdx, newDate] = newIdxDate;
	// 如果日期改变，清空image_path
	if (oldDate !== newDate) {
		snapshots.value.forEach((snapshot) => {
			snapshot.image_path = undefined;
			selectedIdx.value = 0;
		});
		handleDate();
	}
	if (snapshots.value.length > 0 && snapshots.value[newIdx].image_path === undefined) {
		try {
			snapshots.value[newIdx].image_path = '';
			await downloadSnapshotById(newIdx);
		} catch (err) {
			console.error(err);
		}
	}
}, 1000);

//  如果selectedIndex或selectDate改變，下載該照片
watch([selectedIdx, selectDate], (newIdxDate, oldIdxDate) => {
	debouncedFunction(newIdxDate, oldIdxDate);
});

const snapshots = ref<API.Snapshot[]>([]);

const handleDate = () => {
	const { start, end } = getStartEndOfDate(selectDate.value);
	if (start > new Date()) {
		message.error('開始時間不可大於今天');
		resetDate();
		return;
	}

	API.listSnapshotsInRange(selectedIPCam.value!, start.getTime() / 1000, end.getTime() / 1000)
		.then(async (res) => {
			if (!res || res.length === 0) {
				message.error('尚無資料');
				return;
			}
			snapshots.value = res;
			await downloadSnapshotById(0);
			message.success('載入成功');
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
	if (snapshots.value[selectedIdx.value].image_path === undefined) {
		message.error('尚無資料');
		return;
	}
	a.href = snapshots.value[selectedIdx.value].image_path!;
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
			snapshots.value.splice(selectedIdx.value, 1);
			// 更新selectedIdx
			if (selectedIdx.value === snapshots.value.length) {
				selectedIdx.value = snapshots.value.length - 1;
			}
			showModal.value = false;
			message.success('刪除成功');
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
