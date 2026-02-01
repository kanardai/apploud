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

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    });

    function sendEvent(event: string, data: unknown) {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }

    req.on('close', () => {
        res.end();
    });

    try {
        let phase1Done = 0;
        const phase1Total = 4;
        const sendPhase1 = () => {
            phase1Done++;
            sendEvent('progress', {
                phase: 'group',
                message: 'Fetching group info...',
                current: phase1Done,
                total: phase1Total,
            });
        };

        const [gitlabGroup, members, subgroups, projects] = await Promise.all([
            getGroup(groupId).then((r) => { sendPhase1(); return r; }),
            getGroupMembers(groupId).then((r) => { sendPhase1(); return r; }),
            getSubgroups(groupId).then((r) => { sendPhase1(); return r; }),
            getProjects(groupId).then((r) => { sendPhase1(); return r; }),
        ]);

        const usersMap = new Map<string, UserAccess>();

        const sendResult = () => {
            const users = Array.from(usersMap.values());
            sendEvent('result', {
                group: {
                    fullName: gitlabGroup.full_name,
                    description: gitlabGroup.description,
                },
                users,
                totalUsers: users.length,
            });
        };

        for (const member of members) {
            addMemberToMap(usersMap, member, gitlabGroup.full_name);
        }

        sendResult();

        // fetch subgroups members
        let phase2Done = 0;
        const phase2Total = subgroups.length;

        const subgroupMembersResults = await Promise.all(
            subgroups.map((sg) =>
                getGroupMembers(sg.id).then((members) => {
                    phase2Done++;
                    sendEvent('progress', {
                        phase: 'subgroups',
                        message: 'Fetching subgroup members...',
                        current: phase2Done,
                        total: phase2Total,
                    });
                    return { subgroup: sg, members };
                })
            )
        );

        for (const { subgroup, members } of subgroupMembersResults) {
            for (const member of members) {
                addMemberToMap(usersMap, member, subgroup.full_name);
            }
        }

        sendResult();

        // fetch project members
        let phase3Done = 0;
        const phase3Total = projects.length;

        const projectMembersResults = await Promise.all(
            projects.map((p) =>
                getProjectMembers(p.id).then((members) => {
                    phase3Done++;
                    sendEvent('progress', {
                        phase: 'projects',
                        message: 'Fetching project members...',
                        current: phase3Done,
                        total: phase3Total,
                    });
                    return { project: p, members };
                })
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

        sendResult();
        sendEvent('done', {});
        res.end();
    } catch (error) {
        console.error('GitLab API error:', error);
        sendEvent('server-error', { message: 'Failed to fetch GitLab data' });
        res.end();
    }
}
