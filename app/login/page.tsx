import styles from './page.module.css'

export default function Login() {
    return <div className={styles.login}>
        <form action="/api/auth" method="post" className={styles.form}>
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" autoComplete="username" required />
            </div>
            <div>
                <label htmlFor="current-password">Password</label>
                <input id="current-password" name="password" type="password" autoComplete="current-password" required />
            </div>
            <div>
                <button type="submit">Sign in</button>
            </div>
        </form>
    </div>;
}