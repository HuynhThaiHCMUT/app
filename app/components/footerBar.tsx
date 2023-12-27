import styles from './components.module.css'
import { faBell, faCartShopping, faHome, faShop, faUser, faUserCircle} from '@fortawesome/free-solid-svg-icons'


export default async function FooterBar() {
    return <div className={styles.footerBar}>
        <div className={styles.footerSection}>
            <div className={styles.footerColumn}>
                <h2>Nhận ngay ưu đãi 30%!</h2>
                <p>Đăng ký để nhận thông tin khuyến mãi</p>
            </div>
            <div className={styles.footerColumn}>
                <form className={styles.footerForm}>
                    <input type="email" placeholder="Email của bạn"/>
                    <input type="submit" value="Đăng ký"/>
                </form>
            </div>
        </div>
        <div className={styles.whiteln}>  </div>
        <div className={styles.footerSection}>
            <div className={styles.footerColumn}>
                {/* <img src="/logo.png" alt="logo"/> */}
                <h4>Cửa hàng tiện lợi</h4>
                <h3>Dream Team</h3>
            </div>
            <div className={styles.footerColumn}>
                <h3>Liên hệ:</h3>
                <p>dreamteam@hcmut.edu.vn</p>
                <p>0123456789</p>
            </div>
            <div className={styles.footerColumn}>
                <h3>Địa chỉ:</h3>
                <p>411, Tòa nhà H1, Đại học Bách Khoa TP.HCM</p>
            </div>
            <div className={styles.footerColumn}>
                <h3>Social:</h3>
                <ul className={styles.socialList}>
                    <li><a href="https://www.facebook.com/"><i className="fab fa-facebook-f">Facebook</i></a></li>
                    <li><a href="https://www.instagram.com/"><i className="fab fa-instagram">Instagram</i></a></li>
                    <li><a href="https://www.twitter.com/"><i className="fab fa-twitter">Twitter</i></a></li>
                </ul>
            </div>
        </div>
        <div className={styles.footerSection}>
            <small>© 2021 Dream Team. All rights reserved.</small>
        </div>
    </div>;
}   