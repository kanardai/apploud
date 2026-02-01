import http from 'node:http';
import { mockData } from './mockData';

const PORT = 3001;

function sendEvent(res: http.ServerResponse, event: string, data: unknown) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function handleGitlabAccess(res: http.ServerResponse) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    const { users, group } = mockData;

    const buildResult = (userSlice: typeof users) => ({
        group,
        users: userSlice,
        totalUsers: userSlice.length,
    });

    // Phase 1: group info
    for (let i = 1; i <= 4; i++) {
        await delay(300);
        sendEvent(res, 'progress', {
            phase: 'group',
            message: 'Fetching group info...',
            current: i,
            total: 4,
        });
    }

    sendEvent(res, 'result', buildResult(users.slice(0, 10)));

    // Phase 2: subgroup members
    const subgroupTotal = 24;
    for (let i = 1; i <= subgroupTotal; i++) {
        await delay(300);
        sendEvent(res, 'progress', {
            phase: 'subgroups',
            message: 'Fetching subgroup members...',
            current: i,
            total: subgroupTotal,
        });
    }

    sendEvent(res, 'result', buildResult(users.slice(0, 30)));

    // Phase 3: project members
    const projectTotal = 500;
    for (let i = 1; i <= projectTotal; i++) {
        if (i % 10 === 0 || i === projectTotal) {
            await delay(100);
            sendEvent(res, 'progress', {
                phase: 'projects',
                message: 'Fetching project members...',
                current: i,
                total: projectTotal,
            });
        }
    }

    sendEvent(res, 'result', buildResult(users));
    sendEvent(res, 'done', {});
    res.end();
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        });
        res.end();
        return;
    }

    if (url.pathname === '/api/gitlab-access') {
        handleGitlabAccess(res);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, () => {
    console.log(`Mock SSE server running on http://localhost:${PORT}`);
});
