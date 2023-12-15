import styles from './components.module.css'
import { faBell, faCartShopping, faHome, faShop, faUser, faUserCircle} from '@fortawesome/free-solid-svg-icons'
import HeaderTab from './headerTab'


export default async function HeaderBar() {
    return <div className={styles.headerBar}>
        <HeaderTab href='/' icon={faHome} text=""/>
        <HeaderTab href='/sale' icon={faCartShopping} text="Hoá đơn"/>
        <HeaderTab href='/store' icon={faShop} text="Kho hàng"/>
        <HeaderTab href='/staff' icon={faUser} text="Nhân viên"/>
        <HeaderTab href='/stats' icon={faBell} text="Thống kê"/>
        <HeaderTab href='/account' icon={faUserCircle} text="Tài khoản"/>
    </div>;
}   