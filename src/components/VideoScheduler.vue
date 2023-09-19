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
		</div>
		<!-- 表單 -->
		<div class="mt-10 grid w-full flex-col gap-4 sm:grid-cols-2">
			<!-- 選擇啟用與否 -->
			<div class="mx-10 flex items-center justify-between gap-4">
				<label for="activate" class="w-1/3 min-w-max text-lg font-medium text-gray-500">是否啟用</label>
				<select id="activate" class="form-select" v-model="activate">
					<option v-for="activate in activates" :key="activate" :value="activate">{{ activate }}</option>
				</select>
			</div>
			<!-- 選擇照片天 -->
			<div class="mx-10 flex items-center justify-between gap-4">
				<label for="schedulePeriod" class="w-1/3 min-w-max text-lg font-medium text-gray-500">照片天數</label>
				<select :disabled="activate === '停用'" id="schedulePeriod" class="form-select" v-model="schedulePeriod">
					<option v-for="schedulePeriod in schedulePeriods" :key="schedulePeriod" :value="schedulePeriod">{{ schedulePeriod }}</option>
				</select>
			</div>
			<!-- 選擇儲存時間-->
			<div class="mx-10 flex items-center justify-between gap-4">
				<label for="scheduleTiming" class="w-1/3 min-w-max text-lg font-medium text-gray-500">儲存時間點 <br />(4:00 AM)</label>
				<select :disabled="activate === '停用'" id="scheduleTiming" class="form-select" v-model="scheduleTiming">
					<option v-for="scheduleTiming in scheduleTimings" :key="scheduleTiming" :value="scheduleTiming">{{ scheduleTiming }}</option>
				</select>
			</div>
			<!-- 選擇每秒播放張數 -->
			<div class="mx-10 flex items-center justify-between gap-4">
				<label for="frameRate" class="w-1/3 min-w-max text-lg font-medium text-gray-500">每秒播放張數</label>
				<select :disabled="activate === '停用'" id="frameRate" class="form-select" v-model="frameRate">
					<option v-for="rate in frameRates" :key="rate" :value="rate">{{ rate }}</option>
				</select>
			</div>
			<!-- 選擇抽取張數比例 -->
			<div class="mx-10 flex items-center justify-between gap-4">
				<label for="frameRatio" class="w-1/3 min-w-max text-lg font-medium text-gray-500">抽取張數比例</label>
				<select :disabled="activate === '停用'" id="frameRatio" class="form-select" v-model="frameRatio">
					<option v-for="ratio in frameRatios" :key="ratio" :value="ratio">{{ ratio }}</option>
				</select>
			</div>
			<div class="mx-10 flex min-w-max items-center justify-center">
				<button class="rounded-lg bg-emerald-600 px-10 py-2 text-xl font-medium text-white hover:bg-emerald-800" @click="showModal = true">
					儲存
				</button>
			</div>
		</div>
	</div>
	<!-- save modal -->
	<n-modal v-model:show="showModal">
		<n-card style="width: 600px" title="重大更新確認" :bordered="false" size="huge" role="dialog" aria-modal="true">
			<template #header-extra> </template>
			<div class="text-lg font-semibold text-black">確定要儲存此排程？</div>
			<template #footer>
				<div class="flex justify-around">
					<button
						@click="handleSave"
						class="text-normal inline-flex items-center justify-center rounded-lg bg-green-300 px-4 py-2 font-normal hover:bg-green-800"
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NModal, NCard } from 'naive-ui';
import { IPCam, ScheduleConfig, listScheduleByIPCam, updateSchedule } from '@/api';
import { useMessage } from 'naive-ui';
const message = useMessage();

const props = defineProps({
	ipcam: {
		type: Object as () => IPCam,
		required: true,
	},
});
// 影片資訊
const thumbnailSrc = ref('縮圖路徑');
const imageLoading = ref(true);

// 表單資料
const activate = ref('啟用');
const schedulePeriod = ref('1周');
const scheduleTiming = ref<ScheduleWeekday>('星期一');
const frameRate = ref(5);
const frameRatio = ref(1);

// 選項列表
const activates = ['啟用', '停用'];
const frameRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const frameRatios = [1, 2, 4, 8, 16, 32];
const schedulePeriods = ['1周', '2周'];
const scheduleTimings = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
type ScheduleWeekday = '星期一' | '星期二' | '星期三' | '星期四' | '星期五' | '星期六' | '星期日';
const scheduleTimingToScheduleWeekday: Record<ScheduleWeekday, number> = {
	星期一: 1,
	星期二: 2,
	星期三: 3,
	星期四: 4,
	星期五: 5,
	星期六: 6,
	星期日: 7,
};
const ScheduleWeekdayToScheduleTiming: Record<number, ScheduleWeekday> = {
	1: '星期一',
	2: '星期二',
	3: '星期三',
	4: '星期四',
	5: '星期五',
	6: '星期六',
	7: '星期日',
};
// 取得目前的排程設定
onMounted(() => {
	listScheduleByIPCam(props.ipcam)
		.then((res) => {
			const schedule = res.data;
			activate.value = schedule.auto_save ? '啟用' : '停用';
			schedulePeriod.value = schedule.auto_save_period === 1 ? '1周' : '2周';
			scheduleTiming.value = schedule.auto_save_weekday ? ScheduleWeekdayToScheduleTiming[schedule.auto_save_weekday] : '星期一';
			frameRate.value = schedule.auto_save_framerate ? schedule.auto_save_framerate : 5;
			frameRatio.value = schedule.auto_save_frameratio ? schedule.auto_save_frameratio : 1;
		})
		.catch((err) => {
			message.error('取得排程設定失敗');
			console.error(err);
		});
});
// 儲存按鈕
const showModal = ref(false);
const handleSave = () => {
	const schedule: ScheduleConfig = {
		imei: props.ipcam,
		auto_save: activate.value === '啟用',
		auto_save_period: schedulePeriod.value === '1周' ? 1 : 2,
		auto_save_framerate: frameRate.value,
		auto_save_frameratio: frameRatio.value,
		auto_save_weekday: scheduleTimingToScheduleWeekday[scheduleTiming.value],
	};
	updateSchedule(schedule)
		.then((_) => {
			message.success('儲存成功');
			showModal.value = false;
		})
		.catch((err) => {
			message.error('儲存失敗');
			console.error(err);
		});
};
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
