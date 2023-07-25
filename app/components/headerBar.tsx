import styles from './components.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faClock, faHome, faShop} from '@fortawesome/free-solid-svg-icons'
import HeaderTab from './headerTab'

export default function HeaderBar() {
    return <div className={styles.headerBar}>
        <HeaderTab href='/' icon={faHome} text=""/>
        <HeaderTab href='/store' icon={faShop} text="Kho hàng"/>
        <HeaderTab href='/sale' icon={faCartShopping} text="Hoá đơn"/>
        <HeaderTab href='/history' icon={faClock} text="Lịch sử"/>
    </div>;
}   