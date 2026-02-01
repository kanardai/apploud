# GitLab Access Monitor

Web app for monitoring user access to GitLab groups and projects.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
GITLAB_ACCESS_TOKEN=your_gitlab_personal_access_token
GITLAB_API_URL=https://gitlab.com/api/v4
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Mock server

For development without a GitLab token, you can use the mock SSE server that serves generated data:

1. Set `NEXT_PUBLIC_USE_MOCK=true` in `.env.local`
2. Start the mock server:
```bash
npm run server
```
3. Start the frontend:
```bash
npm run dev
```

The mock server runs on `http://localhost:3001` and simulates the same SSE protocol as the real GitLab API route (progress, result, done events).

## Usage

Enter a GitLab Group ID and click Search. The app displays all users with access to the group, its subgroups, and projects.
