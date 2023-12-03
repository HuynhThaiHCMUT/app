import { getServerSession } from 'next-auth'
import { LogoutButton } from '../components/authButton'
import styles from './page.module.css'
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Account() {
    const session = await getServerSession(authOptions);
    return <div className={styles.account}>
        <h2>Thông tin tài khoản</h2>
        <div>
        </div>
        <LogoutButton/>
    </div>
}