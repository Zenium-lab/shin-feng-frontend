<template>
	<div class="h-auto w-full flex-col items-start justify-start gap-6">
		<div class="text-2xl font-bold leading-10 text-black">{{ props.title }}</div>
		<div class="text-base font-normal leading-normal text-black lg:text-lg">{{ props.subtitle }}</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: true,
	},
});
</script>

<style>
/* 可根據需要自定義樣式 */
</style>
