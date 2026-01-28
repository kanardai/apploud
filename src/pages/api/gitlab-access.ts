import { UserAccess } from '@/types/gitlab.types';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
    getGroup,
    getGroupMembers,
    getProjectMembers,
    getProjects,
    getSubgroups,
} from '@/services/gitlabService';
import { addMemberToMap } from '@/services/gitlabUtils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { groupId } = req.query;

    if (!groupId || typeof groupId !== 'string') {
        return res.status(400).json({ error: 'Group ID is required' });
    }

    try {
        const [gitlabGroup, members, subgroups, projects] = await Promise.all([
            getGroup(groupId),
            getGroupMembers(groupId),
            getSubgroups(groupId),
            getProjects(groupId),
        ]);

        const usersMap = new Map<string, UserAccess>();

        for (const member of members) {
            addMemberToMap(usersMap, member, gitlabGroup.full_name);
        }

        // fetch subgroups members
        const subgroupMembersResults = await Promise.all(
            subgroups.map((sg) =>
                getGroupMembers(sg.id).then((members) => ({
                    subgroup: sg,
                    members,
                }))
            )
        );

        for (const { subgroup, members } of subgroupMembersResults) {
            for (const member of members) {
                addMemberToMap(usersMap, member, subgroup.full_name);
            }
        }

        // fetch project members
        const projectMembersResults = await Promise.all(
            projects.map((p) =>
                getProjectMembers(p.id).then((members) => ({
                    project: p,
                    members,
                }))
            )
        );

        for (const { project, members } of projectMembersResults) {
            for (const member of members) {
                addMemberToMap(
                    usersMap,
                    member,
                    undefined,
                    project.path_with_namespace
                );
            }
        }

        const users = Array.from(usersMap.values());

        res.status(200).json({
            group: {
                fullName: gitlabGroup.full_name,
                description: gitlabGroup.description,
            },
            users,
            totalUsers: users.length,
        });
    } catch (error) {
        console.error('GitLab API error:', error);
        res.status(500).json({ error: 'Failed to fetch GitLab data' });
    }
}
