<!-- 復原垃圾桶中的 snapshots -->
<template>
	<!-- Table Section -->
	<div class="mx-auto max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
		<!-- Card -->
		<div class="flex flex-col">
			<div class="-m-1.5 overflow-x-auto">
				<div class="inline-block min-w-full p-1.5 align-middle">
					<div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
						<!-- Header -->
						<div class="grid gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-700 md:flex md:items-center md:justify-between">
							<div>
								<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">畫面照片</h2>
								<p class="text-sm text-gray-600 dark:text-gray-400">復原已刪除的畫面照片</p>
							</div>

							<!-- <div>
              <div class="inline-flex gap-x-2">
                <a class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
                  View all
                </a>

                <a class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800" href="#">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2.63452 7.50001L13.6345 7.5M8.13452 13V2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Add user
                </a>
              </div>
            </div> -->
						</div>
						<!-- End Header -->

						<!-- Table -->
						<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead class="bg-gray-50 dark:bg-slate-800">
								<tr>
									<!-- <th scope="col" class="py-3 pl-6 text-left">
										<div class="flex items-center gap-x-2">
											<span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200"> 圖片 </span>
										</div>
									</th> -->

									<th scope="col" class="py-3 pl-6 text-left">
										<div class="flex items-center gap-x-2">
											<span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200"> 攝影機 </span>
										</div>
									</th>

									<th scope="col" class="py-3 pl-6 text-left">
										<div class="flex items-center gap-x-2">
											<span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200"> 創建時間 </span>
										</div>
									</th>

									<th scope="col" class="py-3 pl-6 text-right"></th>
								</tr>
							</thead>

							<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
								<tr v-for="(s, index) in deletedSnapshots" :key="`restore-${index}`">
									<!-- <td class="h-px w-px whitespace-nowrap">
										<div class="py-3 pl-6">
											<label for="hs-at-with-checkboxes-1" class="flex">
												<input
													type="checkbox"
													class="pointer-events-none shrink-0 rounded border-gray-200 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:focus:ring-offset-gray-800"
													id="hs-at-with-checkboxes-1"
												/>
												<span class="sr-only">Checkbox</span>
											</label>
										</div>
									</td> -->
									<!-- <td class="h-px w-px whitespace-nowrap">
										<div class="py-3 pl-6 pr-6">
											<div class="flex items-center gap-x-3">
												<img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full" :src="s.image_path" alt="Image Description" />
											</div>
										</div>
									</td> -->

									<td class="h-px w-px whitespace-nowrap">
										<div class="py-3 pl-6 pr-6">
											<span class="text-sm text-gray-500">{{ s.imei }}</span>
										</div>
									</td>
									<td class="h-px w-px whitespace-nowrap">
										<div class="py-3 pl-6 pr-6">
											<span class="text-sm text-gray-500">{{ timestampToTime(s.created_at) }}</span>
										</div>
									</td>
									<td class="h-px w-px whitespace-nowrap">
										<div class="px-6 py-1.5">
											<a
												class="inline-flex items-center gap-x-1.5 text-sm font-medium text-blue-600 decoration-2 hover:underline"
												href="#"
												@click="handleRestore(s.id)"
											>
												復原
											</a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<!-- End Table -->

						<!-- Footer -->
						<div class="grid gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700 md:flex md:items-center md:justify-between">
							<div>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									<span class="font-semibold text-gray-800 dark:text-gray-200">{{ deletedSnapshots.length }}</span> results
								</p>
							</div>
							<!-- 
							<div>
								<div class="inline-flex gap-x-2">
									<button
										type="button"
										class="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
									>
										<svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path
												fill-rule="evenodd"
												d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
											/>
										</svg>
										Prev
									</button>

									<button
										type="button"
										class="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
									>
										Next
										<svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
											<path
												fill-rule="evenodd"
												d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
											/>
										</svg>
									</button>
								</div>
							</div> -->
						</div>
						<!-- End Footer -->
					</div>
				</div>
			</div>
		</div>
		<!-- End Card -->
	</div>
	<!-- End Table Section -->
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import * as API from '@/api';
import { useMessage } from 'naive-ui';
import { timestampToTime } from '@/utils/date';
import { useIpcamStore } from '@/stores/ipcam';
const ipcamStore = useIpcamStore();

const message = useMessage();
const selectedIPCam = computed({
	get(): API.IPCam {
		return ipcamStore.ipcam || '';
	},
	set(newIPCam: API.IPCam) {
		ipcamStore.setIpcam(newIPCam);
	},
});

const allDeletedSnapshots = ref<API.Snapshot[]>([]);
onMounted(() => {
	API.listDeletedSnapshots()
		.then((res) => {
			allDeletedSnapshots.value = res.data === null ? [] : res.data;
			// 下載每一個 snapshot的thumbnail path
			// deletedSnapshots.value.forEach((s) => {
			// 	API.downloadThumbnailById(s.id)
			// 		.then((base64Img) => {
			// 			s.image_path = base64Img;
			// 		})
			// 		.catch((err) => {
			// 			message.error('預覽圖下載失敗');
			// 			console.error(err);
			// 		});
			// });
		})
		.catch((err) => {
			message.error('資源回收桶請求失敗');
			console.error(err);
		});
});
// 根據ipcam篩選後的 snapshots
const deletedSnapshots = computed(() => {
	return allDeletedSnapshots.value.filter((s) => s.imei === selectedIPCam.value);
});
const handleRestore = (id: number) => {
	API.restoreDeletedSnapshot(id)
		.then((_) => {
			message.success('復原成功');
			allDeletedSnapshots.value = allDeletedSnapshots.value.filter((s) => s.id !== id);
		})
		.catch((err) => {
			message.error('復原失敗');
			console.error(err);
		});
};
</script>
