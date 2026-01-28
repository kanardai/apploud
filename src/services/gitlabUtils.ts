import {
    GitLabApiMember,
    ACCESS_LEVEL_MAP,
} from '@/types/gitlab-api.types';
import { UserAccess } from '@/types/gitlab.types';

export function addMemberToMap(
    map: Map<string, UserAccess>,
    member: GitLabApiMember,
    groupPath?: string,
    projectPath?: string
) {
    const existing = map.get(member.username);
    const access = ACCESS_LEVEL_MAP[member.access_level] || 'Unknown';

    if (existing) {
        if (groupPath) existing.groups.push({ path: groupPath, access });
        if (projectPath) existing.projects.push({ path: projectPath, access });
    } else {
        map.set(member.username, {
            name: member.name,
            username: member.username,
            avatarUrl: member.avatar_url,
            groups: groupPath ? [{ path: groupPath, access }] : [],
            projects: projectPath ? [{ path: projectPath, access }] : [],
        });
    }
}
