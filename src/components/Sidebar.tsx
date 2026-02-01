import Image from 'next/image';
import styles from './Sidebar.module.scss';
import Footer from './Footer';
import { ProgressEvent } from '@/types/gitlab.types';

interface SidebarProps {
    groupId: string;
    setGroupId: (value: string) => void;
    loading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    progress: ProgressEvent | null;
}

export default function Sidebar({
    groupId,
    setGroupId,
    loading,
    handleSubmit,
    progress,
}: SidebarProps) {
    return (
        <nav className={styles.sidebar}>
            <h1 className={styles.title}>Gitlab Access Monitor</h1>
            <hr className={styles.divider} />

            <div className={styles.hero}>
                <Image
                    src="/hero.png"
                    alt="computer"
                    width={270}
                    height={140}
                    priority
                    className={loading ? styles.heroLoading : ''}
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="number"
                    max={9999999999}
                    min={0}
                    value={groupId}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 10) {
                            setGroupId(value);
                        }
                    }}
                    placeholder="Group ID"
                    className={styles.input}
                />
                <button
                    type="submit"
                    className={styles.button}
                    disabled={loading}
                >
                    Search
                </button>
            </form>

            {progress && (
                <div className={styles.progress}>
                    <p className={styles.progressMessage}>{progress.message}</p>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{
                                width: `${Math.round((progress.current / progress.total) * 100)}%`,
                            }}
                        />
                    </div>
                    <p className={styles.progressCount}>
                        {progress.current} / {progress.total}
                    </p>
                </div>
            )}

            <Footer />
        </nav>
    );
}
