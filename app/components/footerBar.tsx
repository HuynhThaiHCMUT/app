import styles from './components.module.css'

export default function FooterBar() {
    return <div className={styles.footerBar}>
        <div className={styles.footerSection}>
            <div className={styles.footerColumn}>
                <h2>Nhận ngàn ưu đãi!</h2>
                <p>Đăng ký ngay để nhận thông tin khuyến mãi</p>
            </div>
            <div className={styles.footerColumn}>
                <form className={styles.footerForm}>
                    <input name='mail' type="email" placeholder="Địa chỉ Email của bạn"/>
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
                <h4>Email:</h4>
                <p>dreamteam@hcmut.edu.vn</p>
                <h4>Hotline:</h4>
                <p>SĐT: 0123456789</p>
            </div>
            <div className={styles.footerColumn}>
                <h3>Địa chỉ:</h3>
                <p>Tòa nhà H6, Cơ sở 2, Đại học Bách Khoa TP.HCM</p>
            </div>
        </div>
        <div className={styles.footerSection}>
            <small>© 2024 Dream Team. All rights reserved.</small>
        </div>
    </div>;
}   