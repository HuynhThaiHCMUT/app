import styles from './components.module.css'
import { faCartShopping, faClock, faHome, faShop, faWrench} from '@fortawesome/free-solid-svg-icons'
import HeaderTab from './headerTab'


export default async function HeaderBar() {
    return <div className={styles.headerBar}>
        <HeaderTab href='/' icon={faHome} text=""/>
        <HeaderTab href='/store' icon={faShop} text="Kho hàng"/>
        <HeaderTab href='/sale' icon={faCartShopping} text="Hoá đơn"/>
        <HeaderTab href='/history' icon={faClock} text="Lịch sử"/>
        <HeaderTab href='/setting' icon={faWrench} text="Cài đặt"/>
    </div>;
}   