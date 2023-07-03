<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute();
const isLoginPage = route.path === '/login';
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
			<div class="flex items-center gap-8">
				<RouterLink to="/"><div class="rounded-lg px-4 py-1 text-base font-normal text-black hover:bg-gray-300">影片瀏覽</div></RouterLink>
				<RouterLink to="/video"><div class="rounded-lg px-4 py-1 text-base font-normal text-black hover:bg-gray-300">影片剪輯</div></RouterLink>
				<RouterLink to="/user"><div class="rounded-lg px-4 py-1 text-base font-normal text-black hover:bg-gray-300">權限管理</div></RouterLink>
				<RouterLink to="/"><div class="rounded-lg px-4 py-1 text-base font-normal text-black hover:bg-gray-300">自動儲存</div></RouterLink>
			</div>
		</div>
	</nav>

	<div class="relative min-h-screen">
		<RouterView v-if="isLoginPage" />
		<div v-else class="container mx-auto gap-4 px-6 py-8">
			<RouterView />
		</div>
	</div>
	<!-- Footer 內容 -->
	<footer class="bg-gray-200 py-4 text-center">
		<div class="container mx-auto">
			<p class="text-sm text-gray-600">© 2023 新光保全. All rights reserved.</p>
		</div>
	</footer>
</template>

<style scoped></style>
