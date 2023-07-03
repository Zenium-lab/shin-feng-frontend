<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
</script>
<template>
	<div class="container mx-auto gap-4 px-4 py-5">
		<TitleSection title="影片細節" subtitle="影片細節和基本資料" />
	</div>
	<VideoPlayer></VideoPlayer>
</template>
