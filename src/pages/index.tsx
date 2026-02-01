import Head from 'next/head';
import { useState } from 'react';
import styles from './Home.module.scss';
import { ApiResponse, ProgressEvent } from '@/types/gitlab.types';
import { fetchGitlabAccess } from '@/services/frontendService';
import Results from '@/components/Results';
import Sidebar from '@/components/Sidebar';

export default function Home() {
    const [groupId, setGroupId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [progress, setProgress] = useState<ProgressEvent | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!groupId) return;

        setLoading(true);
        setError(null);
        setData(null);
        setProgress(null);

        try {
            const result = await fetchGitlabAccess(groupId, setProgress, setData);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
            setProgress(null);
        }
    };

    return (
        <>
            <Head>
                <title>Gitlab Access Monitor</title>
                <meta
                    name="description"
                    content="Monitoring access to GitLab projects"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Sidebar
                groupId={groupId}
                setGroupId={setGroupId}
                loading={loading}
                handleSubmit={handleSubmit}
                progress={progress}
            />
            <main className={styles.main}>
                {error && <p className={styles.error}>{error}</p>}

                {data && <Results data={data} />}
            </main>
        </>
    );
}
