import Image from 'next/image';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Image
                className={styles.logo}
                src="/next.svg"
                alt="Next.js Logo"
                width={100}
                height={30}
                priority
            />
        </footer>
    );
}
