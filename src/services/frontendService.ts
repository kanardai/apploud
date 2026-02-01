import { ApiResponse, ProgressEvent } from '@/types/gitlab.types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
const MOCK_SERVER_URL = 'http://localhost:3001';

export async function fetchGitlabAccess(
    groupId: string,
    onProgress?: (progress: ProgressEvent) => void,
    onData?: (data: ApiResponse) => void
): Promise<ApiResponse> {
    const baseUrl = USE_MOCK ? MOCK_SERVER_URL : '';
    const url = `${baseUrl}/api/gitlab-access?groupId=${groupId}`;

    return new Promise((resolve, reject) => {
        const es = new EventSource(url);
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
