import styles from './AccessSection.module.scss';

interface AccessSectionProps {
    title: string;
    items: { path: string; access: string }[];
}

export default function AccessSection({ title, items }: AccessSectionProps) {
    if (items.length === 0) return null;

    return (
        <details className={styles.accessSection}>
            <summary>
                {title} ({items.length})
            </summary>
            <ul>
                {items.map((item) => (
                    <li key={item.path}>
                        {item.path}{' '}
                        <span className={styles.role}>🔐&nbsp;{item.access}</span>
                    </li>
                ))}
            </ul>
        </details>
    );
}
