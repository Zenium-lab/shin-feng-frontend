<template>
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="text-md w-full text-left text-gray-800">
			<thead class="bg-gray-50 text-lg uppercase text-gray-700">
				<tr class="text-center">
					<th scope="col" class="px-6 py-3">姓名</th>
					<th scope="col" class="px-6 py-3">角色</th>
					<th scope="col" class="px-6 py-3">帳號</th>
					<th scope="col" class="px-6 py-3">
						<span class="sr-only">Edit</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b bg-white text-center hover:bg-gray-50" v-for="(user, index) in props.users" :key="index">
					<td class="px-6 py-4">
						{{ user.name }}
					</td>
					<td class="">
						<div v-if="user.role === '管理員'" class="mx-auto w-20 rounded bg-red-100 py-0.5 text-sm font-medium text-red-800">管理員</div>
						<div v-else-if="user.role === '編輯者'" class="mx-auto w-20 rounded bg-blue-100 py-0.5 text-sm font-medium text-blue-800">
							{{ user.role }}
						</div>
						<div v-else-if="user.role === '檢視者'" class="mx-auto w-20 rounded bg-green-100 py-0.5 text-sm font-medium text-green-800">檢視者</div>
					</td>
					<td class="px-6 py-4">
						{{ user.account }}
					</td>

					<td class="px-6 py-4 text-center">
						<a href="#" class="font-medium text-red-600 hover:underline" @click="handleDelete(user.id!)">刪除</a>
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
