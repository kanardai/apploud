export interface ApiResponse {
    group: GroupInfo;
    users: UserAccess[];
    totalUsers: number;
}

export interface GroupInfo {
    fullName: string;
    description: string | null;
}

export interface UserAccess {
    name: string;
    username: string;
    avatarUrl: string;
    groups: { path: string; access: string }[];
    projects: { path: string; access: string }[];
}

export type ProgressPhase = 'group' | 'subgroups' | 'projects';

export interface ProgressEvent {
    phase: ProgressPhase;
    message: string;
    current: number;
    total: number;
}
