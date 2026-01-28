import { ApiResponse } from '@/types/gitlab.types';
import styles from './Results.module.scss';
import AccessSection from './AccessSection';
import  Image  from 'next/image';

interface ResultsProps {
    data: ApiResponse;
}

export default function Results({ data }: ResultsProps) {
    return (
        <div className={styles.results}>
            <div className={styles.groupInfo}>
                <h2 className={styles.groupTitle}>{data.group.fullName}</h2>
                {data.group.description && (
                    <p className={styles.groupDescription}>
                        {data.group.description}
                    </p>
                )}
            </div>

            <h3 className={styles.usersTitle}>Users ({data.totalUsers})</h3>

            <div className={styles.userList}>
                {data.users.map((user) => (
                    <div key={user.username} className={styles.userCard}>
                        <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            className={styles.avatar}
                            width={40}
                            height={40}
                        />
                        <h4>
                            {user.name} <span>(@{user.username})</span>
                        </h4>
                        <div className={styles.accessInfo}>
                            <AccessSection title="Groups" items={user.groups} />
                            <AccessSection title="Projects" items={user.projects} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
