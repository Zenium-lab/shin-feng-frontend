export type Status = '已完成' | '處理中' | '已取消' | '失敗';

export interface StatusInfo {
    icon: string;
    color: string;
    statusName: Status;
    statusNumber: number;
}

export interface VideoInfo {
    id: number;
    startTime: string;
    endTime: string;
    creator: string;
    status: Status;
    imageSrc: string;
    progress?: string;
}

export interface LoginRequest {
    account: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface IPCam {
    imei: number;
}

export interface Snapshot {
    id: number;
    created_at: string;
    path: string;
    thumbnail_path: string;
    ipcam_imei: string;
}

export interface VideoInput {
    start_time: number;
    end_time: number;
    fps: number;
    first_snapshot_id: number;
}

export interface Video {
    id: number;
    creator_id: number;
    creator_name: string;
    created_at: string;
    updated_at: string;
    start_time: string;
    end_time: string;
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