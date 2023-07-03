import axios, { AxiosRequestConfig } from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/v1', // 請根據實際情況修改基礎 URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// 登入
export const login = (requestData: LoginRequest): Promise<LoginResponse> => {
    return API.post('/login', requestData);
};

// 取得使用者資料
export const getUser = (id: number): Promise<User> => {
    return API.get(`/users/${id}`);
};

// 獲取用戶列表
export const listUsers = (): Promise<UserMeta[]> => {
    return API.get('/users');
};

// 獲取 IPCam 列表
export const listIPCams = (): Promise<IPCam[]> => {
    return API.get('/ipcams');
};

// 創建 IPCam
export const createIPCam = (ipcam: IPCam): Promise<void> => {
    return API.post('/ipcams', ipcam);
};

// 獲取指定時間段內的截圖列表
export const listSnapshotsInRange = (
    imei: number,
    startTime: number,
    endTime: number
): Promise<Snapshot[]> => {
    return API.get('/snapshots', {
        params: {
            imei,
            start_time: startTime,
            end_time: endTime,
        },
    });
};

// 上傳一張照片
export const createSnapshot = (
    ipcamImei: string,
    image: File,
    createdAt?: number,
): Promise<void> => {
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
export const getSnapshotById = (snapshotId: number): Promise<Snapshot> => {
    return API.get(`/snapshots/${snapshotId}`);
};

// 下載照片
export const downloadSnapshotById = (snapshotId: number): Promise<File> => {
    return API.get(`/snapshots/download/${snapshotId}`, {
        responseType: 'blob',
    }).then(response => response.data);
};

// 下載照片的縮圖
export const downloadThumbnailById = (snapshotId: number): Promise<File> => {
    return API.get(`/snapshots/download/thumbnail/${snapshotId}`, {
        responseType: 'blob',
    }).then(response => response.data);
};

// 取得特定一部影片
export const getVideoById = (videoId: number): Promise<Video> => {
    return API.get(`/videos/${videoId}`);
};

// 下載影片
export const downloadVideoById = (videoId: number): Promise<File> => {
    return API.get(`/videos/download/${videoId}`, {
        responseType: 'blob',
    }).then(response => response.data);
};

// 取得所有影片
export const getAllVideos = (): Promise<Video[]> => {
    return API.get('/videos');
};

// 請求建立影片
export const createVideo = (videoInput: VideoInput): Promise<void> => {
    return API.post('/videos', videoInput);
};

// 取消製作中的影片
export const cancelCreateVideo = (videoId: number): Promise<void> => {
    return API.delete(`/videos/cancel/${videoId}`);
};

// 建立 websocket 連線取得製作進度
export const getVideoProgress = (videoId: number): WebSocket => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}/videos/progress/${videoId}`;
    return new WebSocket(url);
};

// 型別定義
export interface Progress {
    videoId: number;
    progress: number;
    elapsed: number;
    remain: number;
}

export interface LoginRequest {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: number;
    user: UserMeta;
}

export interface IPCam {
    imei: number;
    name: string;
}

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
    imei: number;
}

export interface Video {
    id: number;
    creator_id: number;
    creator_name: string;
    created_at: number;
    updated_at: number;
    start_time: number;
    end_time: number;
    status: '已完成' | '處理中' | '已取消' | '發生錯誤';
    fps: number;
    first_snapshot_id: number;
    video_path: string;
}

export interface UserMeta {
    id: number;
    name: string;
    role: '管理員' | '編輯者' | '檢視者';
    account: string;
}

export interface User extends UserMeta {
    password: string;
}
