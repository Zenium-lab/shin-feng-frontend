<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import UserCard from '@/components/UserCard.vue';
import { onMounted, ref, reactive } from 'vue';
import * as API from '@/api';
import ConfirmModal from '@/components/ConfirmModal.vue';
import type { User } from '@/api';

const users = ref<API.UserMeta[]>([]);
const roles = ['檢視者', '編輯者', '管理員'];
onMounted(() => {
	API.listUsers()
		.then((res) => {
			users.value = res.data;
		})
		.catch((error) => {
			console.error(error);
		});
});
const createUser = () => {
	API.createUser(userForm)
		.then((res) => {
			console.log(res);
			showModal.value = false;
			users.value.push({
				name: userForm.name,
				role: userForm.role,
				account: userForm.account,
			});
		})
		.catch((error) => {
			alert('新增失敗');
			console.error(error);
		});
};
const deleteUser = (userId: number) => {
	API.deleteUser(userId)
		.then(() => {
			console.log('delete success');
			users.value = users.value.filter((user) => user.id !== userId);
		})
		.catch((error) => {
			alert('刪除失敗');
			console.error(error);
		});
};
const userForm: User = reactive({
	name: '',
	role: '檢視者',
	account: '',
	password: '',
});
const showModal = ref(false);
</script>
<template>
	<ConfirmModal v-if="showModal">
		<template #title>
			<p class="text-lg">創建用戶</p>
		</template>
		<template #content>
			<form class="grid grid-cols-2 gap-6">
				<div>
					<label for="name" class="block font-medium text-gray-700">名稱</label>
					<input
						type="text"
						id="name"
						v-model="userForm.name"
						class="rounded- mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="role" class="block font-medium text-gray-700">角色</label>
					<select
						id="role"
						v-model="userForm.role"
						class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
					>
						<option v-for="(r, i) in roles" :key="i" :value="r">{{ r }}</option>
					</select>
				</div>
				<div>
					<label for="account" class="block font-medium text-gray-700">帳號</label>
					<input
						type="text"
						id="account"
						v-model="userForm.account"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					/>
				</div>
				<div>
					<label for="password" class="block font-medium text-gray-700">密碼</label>
					<input
						type="password"
						id="password"
						v-model="userForm.password"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
					/>
				</div>
			</form>
		</template>
		<template #buttons>
			<button
				type="button"
				@click="createUser"
				class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
			>
				建立使用者
			</button>
			<button
				type="button"
				@click="showModal = false"
				class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
			>
				取消
			</button>
		</template>
	</ConfirmModal>
	<div class="container mx-auto gap-4 px-4 py-5">
		<TitleSection title="權限管理" subtitle="管理人員與其權限（管理員, 編輯者, 檢視者）" />
		<div class="mt-6 flex justify-end">
			<div>
				<button class="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600" @click="showModal = true">新增用戶</button>
			</div>
		</div>
	</div>
	<UserCard class="mt-3" v-model:users="users" @delete-item="(userId) => deleteUser(userId)"></UserCard>
</template>
