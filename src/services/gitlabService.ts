import {
    GitLabApiGroup,
    GitLabApiMember,
    GitLabApiProject,
} from '@/types/gitlab-api.types';

const GITLAB_API_URL = process.env.GITLAB_API_URL;
const GITLAB_TOKEN = process.env.GITLAB_ACCESS_TOKEN;

async function gitlabFetch<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${GITLAB_API_URL}${endpoint}`, {
        headers: {
            'PRIVATE-TOKEN': GITLAB_TOKEN || '',
        },
    });
    if (!res.ok) {
        throw new Error(`GitLab API error: ${res.status}`);
    }
    return res.json();
}

export const getGroup = (id: string) =>
    gitlabFetch<GitLabApiGroup>(`/groups/${id}`);

export const getGroupMembers = (id: string | number) =>
    gitlabFetch<GitLabApiMember[]>(`/groups/${id}/members`);

export const getSubgroups = (id: string) =>
    gitlabFetch<GitLabApiGroup[]>(`/groups/${id}/subgroups`);

export const getProjects = (id: string) =>
    gitlabFetch<GitLabApiProject[]>(`/groups/${id}/projects`);

export const getProjectMembers = (id: number) =>
    gitlabFetch<GitLabApiMember[]>(`/projects/${id}/members`);
