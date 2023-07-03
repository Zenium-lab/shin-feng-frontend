<script setup lang="ts">
import TitleSection from '@/components/TitleSection.vue';
import UserCard from '@/components/UserCard.vue';
import { onMounted, ref } from 'vue';
import * as API from '@/api';
const users = ref<API.UserMeta[]>([]);

onMounted(() => {
	API.listUsers()
		.then((res) => {
			users.value = res.data;
		})
		.catch((error) => {
			// users.value = [
			// 	{
			// 		id: 1,
			// 		name: '帥老大',
			// 		role: '編輯者',
			// 		account: 'user1',
			// 	},
			// 	{
			// 		id: 2,
			// 		name: '黃大銘',
			// 		role: '管理員',
			// 		account: 'user2',
			// 	},
			// 	{
			// 		id: 3,
			// 		name: '小豪',
			// 		role: '檢視者',
			// 		account: 'user3',
			// 	},
			// ];
			console.error(error);
		});
});
// const saveChanges = () => {
// 	users.value.forEach((user) => {
// 		if (user.password) {
// 			API.createUser({
// 				id: user.id,
// 				name: user.name,
// 				role: user.role,
// 				account: user.account,
// 				password: user.password,
// 			})
// 				.then(() => {
// 					alert("使用者建立成功")
// 					console.log('create success');
// 				})
// 				.catch((error) => {
// 					console.error(error);
// 				});
// 		}
// 	});
// };
const addUser = () => {
	users.value.push({
		id: users.value.length,
		name: '未命名',
		role: '檢視者',
		account: '',
	});
};
const deleteUser = (userId: number) => {
	users.value = users.value.filter((user) => user.id !== userId);
	API.deleteUser(userId)
		.then(() => {
			console.log('delete success');
		})
		.catch((error) => {
			console.error(error);
		});
};
</script>
<template>
	<div class="container mx-auto gap-4 px-4 py-5">
		<TitleSection title="權限管理" subtitle="管理人員與其權限（管理員, 編輯者, 檢視者）" />
		<div class="mt-6 flex justify-end">
			<!-- <div>
				<button class="rounded-md bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600" @click="saveChanges">儲存</button>
			</div> -->
			<div>
				<button class="rounded-md bg-teal-500 px-4 py-2 text-white hover:bg-teal-600" @click="addUser">新增用戶</button>
			</div>
		</div>
	</div>
	<UserCard class="mt-3" v-model:users="users" @delete-item="(userId) => deleteUser(userId)"></UserCard>
</template>
