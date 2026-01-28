export interface GitLabApiGroup {
    id: number;
    full_name: string;
    description: string | null;
    projects: GitLabApiProject[];
}

export interface GitLabApiProject {
    id: number;
    name: string;
    path_with_namespace: string;
}

export interface GitLabApiMember {
    id: number;
    name: string;
    username: string;
    access_level: number;
    avatar_url: string;
}

export const ACCESS_LEVEL_MAP: Record<number, string> = {
    10: 'Guest',
    20: 'Reporter',
    30: 'Developer',
    40: 'Maintainer',
    50: 'Owner',
};
