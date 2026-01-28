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

## Usage

Enter a GitLab Group ID and click Search. The app displays all users with access to the group, its subgroups, and projects.
