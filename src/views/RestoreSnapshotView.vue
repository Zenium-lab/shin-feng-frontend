<!-- 復原垃圾桶中的 snapshots -->
<template>
	<div class="container mx-auto gap-4 px-4 py-5">
		<TitleSection title="資源回收桶" subtitle="復原刪除" />
	</div>
	<!-- 選擇 IPCam 的 dropdown -->
	<div class="col-span-1 flex items-center justify-center lg:justify-end">
		<IpcamDropdown />
	</div>
	<RestoreSnapshot></RestoreSnapshot>
</template>
<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import RestoreSnapshot from '@/components/RestoreSnapshot.vue';
import IpcamDropdown from '@/components/IpcamDropdown.vue';
</script>
