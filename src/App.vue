<script setup lang="ts">
import { watch, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { NMessageProvider } from 'naive-ui';
const authStore = useAuthStore();
const route = useRoute();
let isLoginPage = ref(route.path === '/login');
watch(
	() => route.path,
	(newPath: string) => {
		isLoginPage.value = newPath === '/login';
		console.log(newPath);
	}
);
const getCurrentYear = () => {
	const date = new Date();
	return date.getFullYear();
};

const handleLogout = () => {
	authStore.logout();
	window.location.reload();
};
</script>

<template>
	<nav v-if="!isLoginPage" class="bg-white shadow">
		<div class="container mx-auto flex items-center justify-between px-4 py-2">
			<RouterLink to="/">
				<div class="flex items-center">
					<!-- Logo -->
					<img class="h-12 w-12" src="images/logo.png" alt="Logo" />

					<!-- Navbar 文字 -->
					<div class="ml-3 text-2xl font-extrabold text-black">新光保全</div>
				</div>
			</RouterLink>
			<!-- Navbar 導航連結 -->
			<div class="flex items-center gap-5">
				<RouterLink to="/"><div class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300">影片瀏覽</div></RouterLink>
				<div class="h-1 w-1 rounded-full bg-black"></div>
				<RouterLink to="/video"><div class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300">影片剪輯</div></RouterLink>
				<div class="h-1 w-1 rounded-full bg-black"></div>
				<RouterLink to="/user"><div class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300">權限管理</div></RouterLink>
				<div class="h-1 w-1 rounded-full bg-black"></div>
				<RouterLink to="/snapshots"><div class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300">畫面觀看</div></RouterLink>
				<div class="h-1 w-1 rounded-full bg-black"></div>
				<RouterLink to="/video/scheduler"
					><div class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300">自動儲存</div></RouterLink
				>

				<!-- Navbar 登出按鈕 -->
				<button class="rounded-lg px-2 py-1 text-sm font-normal text-black text-gray-500 hover:bg-gray-300" @click="handleLogout">登出</button>
			</div>
		</div>
	</nav>
	<div class="relative min-h-screen">
		<NMessageProvider>
			<RouterView v-if="isLoginPage" />
			<div v-else class="container mx-auto gap-4 px-6 py-8">
				<RouterView />
			</div>
		</NMessageProvider>
	</div>
	<!-- Footer 內容 -->
	<footer class="bg-gray-200 py-4 text-center">
		<div class="container mx-auto">
			<p class="text-sm text-gray-600">© {{ getCurrentYear() }} 新光保全. All rights reserved.</p>
		</div>
	</footer>
</template>

<style scoped></style>
