<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { NSelect, useMessage, NModal, NCard } from 'naive-ui';
import { useIpcamStore } from '@/stores/ipcam';
import { IPCam, listIPCams, deleteIPCam, createIPCam } from '@/api';
const message = useMessage();
const ipcamStore = useIpcamStore();
const ipcamList = ref<IPCam[]>([]);
const selectedIPCam = computed({
	get(): IPCam {
		return ipcamStore.ipcam || '';
	},
	set(newIPCam: IPCam) {
		ipcamStore.setIpcam(newIPCam);
	},
});

const handleDeleteIPCam = () => {
	if (selectedIPCam.value) {
		deleteIPCam(selectedIPCam.value)
			.then(async (_) => {
				let result = await getIPCamList();
				ipcamList.value = result || [];
				ipcamStore.setIpcam(ipcamList.value[0] || '');
				message.success('刪除成功');
			})
			.catch((err) => {
				if (err === '權限不足') {
					message.error('權限不足');
				} else {
					message.error('刪除失敗');
				}
			});
	}
};

onBeforeMount(async () => {
	loading.value = true;
	ipcamList.value = await getIPCamList();

	if (selectedIPCam.value === '' && ipcamList.value.length > 0) {
		selectedIPCam.value = ipcamList.value[0];
	}
});
const getIPCamList = async (): Promise<IPCam[]> => {
	try {
		const res = await listIPCams();
		return res.data || [];
	} catch (error) {
		console.error(error);
		return [];
	} finally {
		loading.value = false;
	}
};

const addIPCam = (imei: string) => {
	createIPCam(imei)
		.then(async (_) => {
			ipcamList.value = await getIPCamList();
			ipcamStore.setIpcam(imei);
			ipcamInput.value = '';
			message.success('新增成功');
			showModal.value = false;
		})
		.catch((err) => {
			message.error('新增失敗');
			console.error(err);
		});
};
const showModal = ref(false);
const ipcamInput = ref('');
const loading = ref(false);
</script>

<template>
	<div class="col-span-1 flex items-center justify-center gap-3 lg:justify-end">
		<div class="relative inline-block w-64">
			<n-select
				:loading="loading"
				:disabled="loading"
				v-model:value="selectedIPCam"
				:options="
					ipcamList.map((ipcam) => ({
						label: ipcam,
						value: ipcam,
					}))
				"
				clearable
				@clear="handleDeleteIPCam"
			/>
		</div>
		<button
			@click="showModal = true"
			class="inline-flex items-center justify-center rounded-lg bg-zinc-200 px-4 py-2 font-normal text-black hover:bg-zinc-300"
		>
			新增
		</button>
		<n-modal v-model:show="showModal">
			<n-card style="width: 600px" title="新增 IP Camera (IMEI)" :bordered="false" size="huge" role="dialog" aria-modal="true">
				<template #header-extra> </template>
				<input
					v-model="ipcamInput"
					class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
					id="IPCam"
					type="text"
					placeholder="IPCam ex. 1234567890"
				/>

				<template #footer>
					<div class="flex justify-around">
						<button
							@click="addIPCam(ipcamInput)"
							class="py-2font-normal inline-flex items-center justify-center rounded-lg bg-green-200 px-4 text-black hover:bg-green-300"
						>
							確定
						</button>
						<button
							class="inline-flex items-center justify-center rounded-lg bg-red-200 px-4 py-2 font-normal text-black hover:bg-red-300"
							@click="showModal = false"
						>
							取消
						</button>
					</div>
				</template>
			</n-card>
		</n-modal>
	</div>
</template>
