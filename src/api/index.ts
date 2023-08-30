import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const API = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL + '/api/v1', // 請根據實際情況修改基礎 URL
	headers: {
		'Content-Type': 'application/json',
	},
});

// 攔截器加入 Auth token
API.interceptors.request.use((config) => {
	const authStore = useAuthStore();
	const token = authStore.token;
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

// 添加响应拦截器
API.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error) => {
		// 处理响应错误
		if (error.response) {
			// 请求已发出，但服务器响应的状态码不在 2xx 范围内
			console.log('Response Error:', error.response.status);
			console.log('Response Data:', error.response.data);
			// 处理特定的错误状态码
			if (error.response.status === 401) {
				{
					router.push('/login');
				}
			} else if (error.request) {
				// 请求已发出，但没有收到响应
				console.log('No Response:', error.request);
			} else {
				// 发送请求时出错
				console.log('Error:', error.message);
			}
			return Promise.reject(error);
		}
	}
);
// 登入
export const login = (requestData: LoginRequest) => {
	return API.post<LoginResponse>('/users/login', requestData);
};

// 取得使用者資料
export const getUser = (id: number) => {
	return API.get<User>(`/users/${id}`);
};

// 獲取用戶列表
export const listUsers = () => {
	return API.get<UserMeta[]>('/users') || [];
};
// 新增使用者
export const createUser = (userData: User) => {
	return API.post('/users', userData);
};

// 刪除使用者
export const deleteUser = (id: number) => {
	return API.delete(`/users/${id}`);
};
// 獲取 IPCam 列表
export const listIPCams = () => {
	return API.get<IPCam[]>('/ipcams') || [];
};

// 創建 IPCam
export const createIPCam = (imei: IPCam): Promise<void> => {
	return API.post('/ipcams', {
		imei,
	});
};
// 刪除 IPCam
export const deleteIPCam = (imei: IPCam): Promise<void> => {
const authStore = useAuthStore();

	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	return API.delete(`/ipcams/${imei}`);
};
// 獲取指定時間段內的截圖列表
export const listSnapshotsInRange = async (imei: string, startTime: number, endTime: number): Promise<Snapshot[]> => {
	return API.get('/snapshots', {
		params: {
			imei,
			start_time: startTime,
			end_time: endTime,
		},
	}).then((response) => response.data || []);
};

// 上傳一張照片
export const createSnapshot = (ipcamImei: string, image: File, createdAt?: number): Promise<void> => {
	const authStore = useAuthStore();
	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	const formData = new FormData();
	formData.append('ipcam_imei', ipcamImei);
	if (createdAt) {
		formData.append('created_at', createdAt.toString());
	}
	formData.append('image', image);

	const config: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	};

	return API.post('/snapshots', formData, config);
};

// 取得截圖的 metadata
export const getSnapshotById = (snapshotId: number) => {
	return API.get<Snapshot>(`/snapshots/${snapshotId}`);
};

// 下載照片
export const downloadSnapshotById = async (snapshotId: number) => {
	return API.get<File>(`/snapshots/download/${snapshotId}`, {
		responseType: 'blob',
	})
		.then((response) => response.data)
		.then((blob) => URL.createObjectURL(blob));
};


// 刪除照片
export const deleteSnapshotById = (snapshotId: number) => {
const authStore = useAuthStore();

	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	return API.delete<void>(`/snapshots/${snapshotId}`);
};
// 下載照片的縮圖
export const downloadThumbnailById = async (snapshotId: number) => {
	return API.get<File>(`/snapshots/download/thumbnail/${snapshotId}`, {
		responseType: 'blob',
	}).then((response) => response.data);
};

// 

// 取得特定一部影片
export const getVideoById = (videoId: number) => {
	return API.get<Video>(`/videos/${videoId}`);
};

// 下載影片
export const downloadVideoById = async (videoId: number) => {
	return API.get<File>(`/videos/download/${videoId}`, {
		responseType: 'blob',
	}).then((response) => response.data);
};

// 取得所有影片
export const getAllVideos = () => {
	return API.get<Video[]>('/videos') || [];
};

// 請求建立影片
export const createVideo = (videoInput: VideoInput) => {
	const authStore = useAuthStore();
	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	return API.post<void>('/videos', videoInput);
};

// 刪除影片
export const deleteVideo = (videoId: number) => {
	const authStore = useAuthStore();
	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	return API.delete<void>(`/videos/${videoId}`);
};

// 取消製作中的影片
export const cancelCreateVideo = (videoId: number) => {
	const authStore = useAuthStore();
	if (authStore.userRole === '檢視者'){
		return Promise.reject('權限不足')
	}
	return API.delete<void>(`/videos/cancel/${videoId}`);
};



// 建立 websocket 連線取得製作進度
export const getVideoProgress = (videoId: number): WebSocket => {
	let origin =  import.meta.env.VITE_BASE_URL
	if (origin.startsWith('https:')) {
        origin = origin.replace('https:', 'wss:');
    } else if (origin.startsWith('http:')) {
        origin = origin.replace('http:', 'ws:');
    }

	const url = `${origin}/api/v1/videos/progress?videoId=${videoId}`;
	console.log(url);
	return new WebSocket(url);
};

// 型別定義
export interface Progress {
	videoId: number;
	progress: number;
	type: "下載中" |  "製作中"
	elapsed: number;
	remain: number;
}

export interface LoginRequest {
	account: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: UserMeta;
}

export type IPCam = string;

export interface Snapshot {
	id: number;
	created_at: number;
	path: string;
	thumbnail_path: string;
	ipcam_imei: number;
}

export interface VideoInput {
	creator_id: number;
	start_time: number;
	end_time: number;
	fps: number;
	imei: string;
}

export interface Video {
	id: number;
	imei: string;
	creator_id: number;
	creator_name: string;
	created_at: number;
	updated_at: number;
	start_time: number;
	end_time: number;
	status: '已完成' | '處理中' | '已取消' | '發生錯誤' | '系統排程';
	fps: number;
	first_snapshot_id: number;
	video_path: string;
}

export interface UserMeta {
	id?: number;
	name: string;
	role: '管理員' | '編輯者' | '檢視者';
	account: string;
	password?: string;
}

export interface User extends UserMeta {
	password: string;
}
