<script setup lang="ts">
import { watch, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { NMessageProvider } from 'naive-ui';
import router from './router';
const authStore = useAuthStore();
const route = useRoute();
const isDemo = ref(import.meta.env.VITE_APP_MODE === 'demo');
const navigations = [
	{ name: '影片瀏覽', href: '/', current: true, permission: 'viewer' },
	{ name: '影片剪輯', href: '/video', current: false, permission: 'editor' },
	{ name: '權限管理', href: '/user', current: false, permission: 'admin' },
	{ name: '畫面觀看', href: '/snapshots', current: false, permission: 'viewer' },
	{ name: '自動儲存', href: '/scheduler', current: false, permission: 'editor' },
	{ name: '資源回收桶', href: '/restore', current: false, permission: 'editor' },
];
let isLoginPage = ref(route.path === '/login');
watch(
	() => route.path,
	(newPath: string) => {
		isLoginPage.value = newPath === '/login';
		console.log(newPath);
	}
);

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
	isMobileMenuOpen.value = false;
};

const getCurrentYear = () => {
	const date = new Date();
	return date.getFullYear();
};

const handleLogout = () => {
	authStore.logout();
	router.push('/login');
};

const hasVideoEditPermission = (): boolean => {
	return authStore.userRole === '管理員' || authStore.userRole === '編輯者';
};

const hasUserEditPermission = (): boolean => {
	return authStore.userRole === '管理員';
};

const hasPermission = (permission: string) => {
	if (permission === 'viewer') {
		return true;
	} else if (permission === 'editor') {
		return hasVideoEditPermission();
	} else if (permission === 'admin') {
		return hasUserEditPermission();
	}
};
const handleClick = (nav: any) => {
	navigations.forEach((item) => {
		item.current = item.name === nav.name;
	});
	if (isMobileMenuOpen.value) {
		closeMobileMenu();
	}
};
</script>
<template>
	<div>
		<nav v-if="!isLoginPage" class="relative z-50 bg-white shadow">
			<div class="container mx-auto flex items-center justify-between px-4 py-2">
				<RouterLink to="/">
					<div class="flex items-center">
						<!-- Logo -->
						<img class="h-12 w-12" src="images/logo.png" alt="Logo" />
						<!-- Navbar 文字 -->
						<div class="ml-3 text-2xl font-extrabold text-black">新光保全</div>
					</div>
				</RouterLink>

				<!-- Desktop menu -->
				<div class="hidden items-center gap-5 sm:flex">
					<template v-for="(nav, index) in navigations">
						<RouterLink :to="nav.href" v-if="hasPermission(nav.permission)">
							<div
								:key="index"
								class="rounded-lg px-1 py-1 text-base font-normal text-black hover:bg-gray-300"
								:class="{ 'bg-gray-300': nav.current }"
								@click="handleClick(nav)"
							>
								{{ nav.name }}
							</div>
						</RouterLink>
						<div class="h-1 w-1 rounded-full bg-black" v-if="index !== navigations.length - 1 && hasPermission(nav.permission)"></div>
					</template>
					<!-- Navbar 登出按钮 -->
					<button class="hidden rounded-lg px-2 py-1 text-sm font-normal text-gray-500 hover:bg-gray-300 sm:block" @click="handleLogout">登出</button>
				</div>

				<!-- Mobile menu button -->
				<button @click="toggleMobileMenu" class="p-2 focus:outline-none sm:hidden">
					<svg
						class="h-6 w-6 text-gray-500 hover:text-gray-700"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M4 6h16M4 12h16M4 18h16"></path>
					</svg>
				</button>
			</div>
		</nav>

		<!-- Mobile menu, show/hide based on menu state. -->
		<Transition name="slide-fancy" mode="out-in">
			<div v-show="isMobileMenuOpen" class="fixed z-20 w-full">
				<div class="flex flex-col items-center justify-center bg-zinc-50 p-2">
					<template v-for="(nav, index) in navigations" :key="index">
						<RouterLink :to="nav.href" v-if="hasPermission(nav.permission)" class="w-full">
							<div
								:key="index"
								class="w-full rounded-lg px-1 py-2 text-center text-lg font-normal text-black hover:bg-gray-300"
								:class="{ 'bg-gray-300': nav.current }"
								@click="handleClick(nav)"
							>
								{{ nav.name }}
							</div>
						</RouterLink>
						<div class="h-1 w-1 rounded-full bg-black" v-if="index !== navigations.length - 1 && hasPermission(nav.permission)"></div>
					</template>
					<!-- Navbar 登出按钮 -->
					<button class="hidden rounded-lg px-2 py-1 text-sm font-normal text-gray-500 hover:bg-gray-300 sm:block" @click="handleLogout">登出</button>
				</div>
			</div>
		</Transition>
		<div v-if="isDemo" class="fixed bottom-0 right-1 z-50 select-none bg-transparent font-mono text-[88px] text-black/10 shadow-slate-600">Demo</div>
		<!-- Mobile menu overlay to close the menu when clicked -->
		<div id="mobile-menu-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu" class="fixed inset-0 z-10 bg-black opacity-50"></div>
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
	</div>
</template>

<style scoped>
.slide-fancy-enter-active,
.slide-fancy-leave-active {
	transition: transform 0.5s cubic-bezier(0.52, -0.11, 0.47, 1.22), opacity 0.5s ease, scale 0.5s ease;
}

.slide-fancy-enter,
.slide-fancy-leave-to {
	transform: translateY(-100%) scale(0.95);
	opacity: 0;
}

/* 在開始和結束時，我們可以加入稍微的縮放和透明度變化 */
.slide-fancy-enter-to,
.slide-fancy-leave {
	transform: translateY(0) scale(1);
	opacity: 1;
}
</style>
