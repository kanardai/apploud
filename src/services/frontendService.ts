import { ApiResponse } from '@/types/gitlab.types';

export async function fetchGitlabAccess(groupId: string): Promise<ApiResponse> {
    const res = await fetch(`/api/gitlab-access?groupId=${groupId}`);

    if (!res.ok) {
        throw new Error('Failed to load data');
    }

    return res.json();
}
