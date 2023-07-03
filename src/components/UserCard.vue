<template>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="text-md w-full text-left text-gray-800">
			<thead class="bg-gray-50 text-lg uppercase text-gray-700">
				<tr>
					<th scope="col" class="px-6 py-3">姓名</th>
					<th scope="col" class="px-6 py-3">角色</th>
					<th scope="col" class="px-6 py-3">帳號</th>
					<th scope="col" class="px-6 py-3">
						<span class="sr-only">Edit</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b bg-white hover:bg-gray-50" v-for="(user, index) in props.users" :key="index">
					<td class="px-6 py-4">
						<input
							type="text"
							v-model="user.name"
							class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</td>

					<td class="px-6 py-4">
						<select v-model="user.role" class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
							<option value="編輯者">編輯者</option>
							<option value="管理員">管理員</option>
							<option value="檢視者">檢視者</option>
						</select>
					</td>
					<td class="px-6 py-4">
						<input
							type="account"
							v-model="user.account"
							class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</td>

					<td class="px-6 py-4 text-right">
						<a href="#" class="font-medium text-red-600 hover:underline" @click="handleDelete(user.id)">刪除</a>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { UserMeta } from '@/api';
const props = defineProps({
	users: {
		type: Array as PropType<UserMeta[]>,
		required: true,
	},
});
// 刪除使用者
const emit = defineEmits(['delete-item']);
const handleDelete = (id: number) => {
	emit('delete-item', id);
};
</script>

<style scoped>
table {
	table-layout: fixed;
	width: 100%;
}

th,
td {
	width: 25%;
}
</style>
