'use client'

import styles from './components.module.css'
import { signIn, signOut } from "next-auth/react"

export function LoginButton() {
    return <button className={styles.authButton} onClick={() => signIn()}>
        Đăng nhập
    </button>
}

export function LogoutButton() {
    return <button className={styles.authButton} onClick={() => signOut({ callbackUrl: '/' })}>
        Đăng xuất
    </button>
}