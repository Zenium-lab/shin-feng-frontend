<template>
	<div
		class="grid cursor-pointer grid-cols-3 items-center justify-center gap-2.5 rounded-md p-2"
		:class="[
			'hover:bg-zinc-100',
			'focus:bg-zinc-200',
			'focus:outline-none',
			'transition-colors',
			'duration-200',
			'ease-in-out',
			{ 'bg-zinc-200': props.isSelected },
		]"
		tabindex="0"
	>
		<!-- 圖標 -->
		<div class="invisible h-0 sm:visible sm:col-span-1 sm:h-auto">
			<img :src="props.icon" alt="圖標" class="h-12 w-12" />
		</div>
		<!-- 狀態名稱和狀態數字 -->
		<div class="col-span-3 flex min-w-max flex-col items-center justify-center gap-2.5 sm:col-span-2">
			<!-- 狀態名稱 -->
			<div class="text-sm font-bold text-black lg:text-base">{{ props.statusName }}</div>
			<!-- 狀態數字 -->
			<div class="text-xl font-bold text-black lg:text-2xl">{{ props.statusNumber }}</div>
			<div :class="['mx-auto h-1 w-12 rounded-full', props.color]"></div>
		</div>
		<!-- 狀態燈號 -->
	</div>
</template>

<style>
.transition-colors {
	transition-property: background-color;
}
.duration-200 {
	transition-duration: 200ms;
}
.ease-in-out {
	transition-timing-function: ease-in-out;
}
</style>

<script setup lang="ts">
const props = defineProps({
	statusName: {
		type: String,
		required: true,
	},
	statusNumber: {
		type: Number,
		required: true,
	},
	icon: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	isSelected: {
		type: Boolean,
		default: false,
	},
});
</script>
