<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import * as API from '@/api';
const authStore = useAuthStore();
const router = useRouter();
const username = ref('');
const password = ref('');
// 登入處理邏輯
const handleLogin = async () => {
	try {
		const response = await API.login({ account: username.value, password: password.value });
		const { token, user } = response.data;
		authStore.login(token, user);
		router.push('/');
	} catch (error) {
		// TODO: 應該用一個浮起起來的東東顯示錯誤訊息
		alert('登入失敗')
		console.error(error);
	}
};
</script>

<template>
	<div class="flex h-screen flex-col lg:flex-row">
		<!-- 品牌照片 -->
		<div class="flex w-1/2 items-center justify-center lg:block">
			<div class="h-full w-full bg-[url('/images/bg.png')]" style="background-position: center center; object-fit: cover"></div>
		</div>

		<!-- 登入框 -->
		<div class="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 lg:p-16">
			<div class="mb-6 text-2xl font-semibold">單一入口登入</div>
			<div class="mb-6 w-full max-w-sm">
				<!-- Username 欄位 -->
				<div class="mb-4 flex items-center rounded-md border border-black px-4 py-2">
					<div class="h-6 w-6">
						<img src="svgs/account.svg" alt="Account" class="h-full w-full" />
					</div>
					<input v-model="username" type="text" placeholder="帳號" class="ml-2 flex-grow bg-transparent focus:outline-none" />
				</div>
				<!-- Password 欄位 -->
				<div class="flex items-center rounded-md border border-black px-4 py-2">
					<div class="h-6 w-6">
						<img src="svgs/lock.svg" alt="Account" class="h-full w-full" />
					</div>
					<input v-model="password" type="password" placeholder="密碼" class="ml-2 flex-grow bg-transparent focus:outline-none" />
				</div>
			</div>
			<!-- 登入按鈕 -->
			<button class="mb-4 rounded-lg bg-black px-6 py-2 text-xl font-normal text-white" @click="handleLogin">登入</button>
			<!-- 忘記密碼連結 -->
			<a href="#" class="text-lg font-normal text-zinc-500">忘記密碼</a>
			<!-- 公司聯絡資訊 -->
			<div class="mt-8 text-sm text-gray-500">
				公司名稱: ABC 公司<br />
				電話: 123-456-7890<br />
				Email: info@abc.com
			</div>
		</div>
	</div>
</template>
