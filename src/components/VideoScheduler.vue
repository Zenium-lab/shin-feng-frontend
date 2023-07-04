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
		<form class="mt-10 grid w-full grid-cols-2 flex-col gap-4">
			<!-- 選擇啟用與否 -->
			<div class="flex items-center gap-4">
				<label for="activate" class="w-1/3 text-center text-lg font-medium text-gray-500">是否啟用</label>
				<select id="activate" class="form-select" v-model="activate">
					<option v-for="activate in activates" :key="activate" :value="activate">{{ activate }}</option>
				</select>
			</div>
			<!-- 選擇照片天 -->
			<div class="flex items-center gap-4">
				<label for="schedulePeriod" class="w-1/3 text-center text-lg font-medium text-gray-500">照片天數</label>
				<select :disabled="activate === '停用'" id="schedulePeriod" class="form-select" v-model="schedulePeriod">
					<option v-for="schedulePeriod in schedulePeriods" :key="schedulePeriod" :value="schedulePeriod">{{ schedulePeriod }}</option>
				</select>
			</div>
			<!-- 選擇儲存時間-->
			<div class="flex items-center gap-4">
				<label for="scheduleTiming" class="w-1/3 text-center text-lg font-medium text-gray-500">儲存時間點</label>
				<select :disabled="activate === '停用'" id="scheduleTiming" class="form-select" v-model="scheduleTiming">
					<option v-for="scheduleTiming in scheduleTimings" :key="scheduleTiming" :value="scheduleTiming">{{ scheduleTiming }}</option>
				</select>
			</div>
			<!-- 選擇每秒播放張數 -->
			<div class="flex items-center gap-4">
				<label for="frameRate" class="w-1/3 text-center text-lg font-medium text-gray-500">每秒播放張數</label>
				<select :disabled="activate === '停用'" id="frameRate" class="form-select" v-model="frameRate">
					<option v-for="rate in frameRates" :key="rate" :value="rate">{{ rate }}</option>
				</select>
			</div>
			<!-- 選擇抽取張數比例 -->
			<div class="flex items-center gap-4">
				<label for="frameRatio" class="w-1/3 text-center text-lg font-medium text-gray-500">抽取張數比例</label>
				<select :disabled="activate === '停用'" id="frameRatio" class="form-select" v-model="frameRatio">
					<option v-for="ratio in frameRatios" :key="ratio" :value="ratio">{{ ratio }}</option>
				</select>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 影片資訊
const thumbnailSrc = ref('縮圖路徑');
const imageLoading = ref(true);

// 表單資料
const activate = ref('啟用');
const schedulePeriod = ref('1周');
const scheduleTiming = ref('星期一');
const frameRate = ref(5);
const frameRatio = ref(1);

// 選項列表
const activates = ['啟用', '停用'];
const frameRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const frameRatios = [1, 2, 4, 8, 16, 32];
const schedulePeriods = ['1周', '2周'];
const scheduleTimings = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
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
