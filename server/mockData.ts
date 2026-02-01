import { ApiResponse, UserAccess } from '@/types/gitlab.types';

// ~50 users, ~25 groups, ~500 projects

const accessLevels = ['Guest', 'Reporter', 'Developer', 'Maintainer', 'Owner'];

const groupNames = [
    'backend', 'frontend', 'devops', 'qa', 'mobile',
    'data', 'platform', 'security', 'design', 'analytics',
    'infra', 'ml', 'payments', 'auth', 'notifications',
    'search', 'media', 'integrations', 'reporting', 'tools',
    'core', 'sdk', 'docs', 'internal',
];

const projectPrefixes = [
    'api', 'web', 'mobile', 'admin', 'dashboard',
    'service', 'lib', 'cli', 'worker', 'proxy',
    'gateway', 'auth', 'billing', 'notifications', 'search',
    'analytics', 'reporting', 'config', 'monitor', 'scheduler',
];

const projectSuffixes = [
    'gateway', 'app', 'client', 'server', 'core',
    'utils', 'handler', 'processor', 'manager', 'engine',
    'service', 'worker', 'bridge', 'adapter', 'connector',
    'proxy', 'cache', 'store', 'queue', 'stream',
    'tracker', 'loader', 'parser', 'builder', 'runner',
];

const firstNames = [
    'Jan', 'Petr', 'Martin', 'Tomáš', 'Jakub',
    'Lukáš', 'David', 'Filip', 'Ondřej', 'Adam',
    'Eva', 'Anna', 'Marie', 'Tereza', 'Kateřina',
    'Lucie', 'Barbora', 'Michaela', 'Petra', 'Veronika',
    'Marek', 'Pavel', 'Jiří', 'Matěj', 'Daniel',
    'Vojtěch', 'Štěpán', 'Radek', 'Michal', 'Robert',
    'Simona', 'Klára', 'Markéta', 'Alena', 'Monika',
    'Hana', 'Lenka', 'Zuzana', 'Kristýna', 'Denisa',
    'Viktor', 'Aleš', 'Igor', 'René', 'Patrik',
    'Roman', 'Kamil', 'Milan', 'Vladimír', 'Stanislav',
];

const lastNames = [
    'Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý',
    'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec',
    'Pokorný', 'Marek', 'Pospíšil', 'Hájek', 'Jelínek',
    'Král', 'Růžička', 'Beneš', 'Fiala', 'Sedláček',
    'Doležal', 'Zeman', 'Kolář', 'Navrátil', 'Čermák',
    'Vaněk', 'Urban', 'Blažek', 'Kříž', 'Kopecký',
    'Konečný', 'Malý', 'Holub', 'Čech', 'Štěpánek',
    'Kovář', 'Šimek', 'Bartoš', 'Vlček', 'Polák',
    'Musil', 'Kratochvíl', 'Píšek', 'Tichý', 'Kadlec',
    'Šťastný', 'Kohout', 'Doubek', 'Mareš', 'Sýkora',
];

function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return s / 2147483647;
    };
}

function generateLargeMockData(): ApiResponse {
    const rand = seededRandom(42);
    const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

    const groups = groupNames.map((name) => `apploud/engineering/${name}`);
    const allGroups = ['apploud/engineering', ...groups]; // 25 groups total

    const projects: string[] = [];
    for (const prefix of projectPrefixes) {
        for (const suffix of projectSuffixes) {
            if (projects.length >= 500) break;
            const group = pick(groups);
            projects.push(`${group}/${prefix}-${suffix}`);
        }
        if (projects.length >= 500) break;
    }

    const users: UserAccess[] = [];
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[i];
        const lastName = lastNames[i];
        const username = `${firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

        // Each user belongs to 1-5 groups
        const userGroupCount = 1 + Math.floor(rand() * 5);
        const userGroups: { path: string; access: string }[] = [];
        const usedGroups = new Set<string>();
        for (let g = 0; g < userGroupCount; g++) {
            const group = pick(allGroups);
            if (!usedGroups.has(group)) {
                usedGroups.add(group);
                userGroups.push({
                    path: group,
                    access: pick(accessLevels),
                });
            }
        }

        // Each user has access to 5-30 projects
        const userProjectCount = 5 + Math.floor(rand() * 26);
        const userProjects: { path: string; access: string }[] = [];
        const usedProjects = new Set<string>();
        for (let p = 0; p < userProjectCount; p++) {
            const project = pick(projects);
            if (!usedProjects.has(project)) {
                usedProjects.add(project);
                userProjects.push({
                    path: project,
                    access: pick(accessLevels),
                });
            }
        }

        users.push({
            name: `${firstName} ${lastName}`,
            username,
            avatarUrl: `https://secure.gravatar.com/avatar/${i + 10}?s=80&d=identicon`,
            groups: userGroups,
            projects: userProjects,
        });
    }

    return {
        group: {
            fullName: 'Apploud / Engineering',
            description: 'Production engineering organization with all teams and services',
        },
        users,
        totalUsers: users.length,
    };
}

export const mockData = generateLargeMockData();
