import { ApiResponse, ProgressEvent } from '@/types/gitlab.types';
import { mockData } from './mockData';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function fetchGitlabAccess(
    groupId: string,
    onProgress?: (progress: ProgressEvent) => void,
    onData?: (data: ApiResponse) => void
): Promise<ApiResponse> {
    if (USE_MOCK) {
        return fetchMockWithProgress(onProgress, onData);
    }

    return new Promise((resolve, reject) => {
        const es = new EventSource(`/api/gitlab-access?groupId=${groupId}`);
        let latestData: ApiResponse | null = null;

        es.addEventListener('progress', (e) => {
            const data: ProgressEvent = JSON.parse((e as MessageEvent).data);
            onProgress?.(data);
        });

        es.addEventListener('result', (e) => {
            latestData = JSON.parse((e as MessageEvent).data);
            onData?.(latestData!);
        });

        es.addEventListener('done', () => {
            es.close();
            if (latestData) {
                resolve(latestData);
            } else {
                reject(new Error('No data received'));
            }
        });

        es.addEventListener('server-error', (e) => {
            es.close();
            const data = JSON.parse((e as MessageEvent).data);
            reject(new Error(data.message));
        });

        es.onerror = () => {
            es.close();
            reject(new Error('Connection lost'));
        };
    });
}

async function fetchMockWithProgress(
    onProgress?: (progress: ProgressEvent) => void,
    onData?: (data: ApiResponse) => void
): Promise<ApiResponse> {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const { users, group } = mockData;

    const buildResponse = (userSlice: typeof users): ApiResponse => ({
        group,
        users: userSlice,
        totalUsers: userSlice.length,
    });

    // Phase 1: group info
    for (let i = 1; i <= 4; i++) {
        await delay(300);
        onProgress?.({
            phase: 'group',
            message: 'Fetching group info...',
            current: i,
            total: 4,
        });
    }

    // After phase 1: show first batch of users
    onData?.(buildResponse(users.slice(0, 10)));

    // Phase 2: subgroup members
    const subgroupTotal = 24;
    for (let i = 1; i <= subgroupTotal; i++) {
        await delay(300);
        onProgress?.({
            phase: 'subgroups',
            message: 'Fetching subgroup members...',
            current: i,
            total: subgroupTotal,
        });
    }

    // After phase 2: show more users
    onData?.(buildResponse(users.slice(0, 30)));

    // Phase 3: project members
    const projectTotal = 500;
    for (let i = 1; i <= projectTotal; i++) {
        if (i % 10 === 0 || i === projectTotal) {
            await delay(100);
            onProgress?.({
                phase: 'projects',
                message: 'Fetching project members...',
                current: i,
                total: projectTotal,
            });
        }
    }

    // Final: all users
    onData?.(mockData);

    return mockData;
}
