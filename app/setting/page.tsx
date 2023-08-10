import { LoginButton, LogoutButton } from '../components/authButton'
import styles from './page.module.css'

export default function Setting() {
    return <div className={styles.setting}>
        <LogoutButton/>
    </div>
}