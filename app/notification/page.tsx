import { LogoutButton } from '../components/authButton'
import styles from './page.module.css'

export default function Notification() {
    let expiring: {name: string, day: number}[] = [
        {name: "Bánh phồng tôm", day: 7},
        {name: "Sữa Vinamilk", day: 8},
        {name: "Bánh Oreo", day: 10},
        {name: "Mì hảo hảo", day: 20}
    ];
    let shortage: {name: string, stock: number}[] = [
        {name: "Tương ớt", stock: 5},
        {name: "Bột giặt", stock: 10},
        {name: "Bút bi", stock: 30}
    ];
    let report: {date: string, revenue: number, profit: number}[] = [
        {date: "10-10-2023", revenue: 1239000, profit: 312000},
        {date: "9-10-2023", revenue: 1327000, profit: 328000},
        {date: "8-10-2023", revenue: 1079000, profit: 288000},
        {date: "7-10-2023", revenue: 1527000, profit: 428000},
    ];

    return <div className={styles.notification}>
        <div className={styles.notify}>
            <div className={styles.panel}>
                <h3>Danh sách vật phẩm sắp hết hạn</h3>
                <div className={styles.container}>
                {expiring.map((value, index) => <p key={index}>{value.name + " còn " + value.day + " này nữa hết hạn"}</p> )}
                </div>
            </div>
            <div className={styles.panel}>
                <h3>Danh sách vật phẩm sắp hết hàng</h3>
                <div className={styles.container}>
                {shortage.map((value, index) => <p key={index}>{value.name + " sắp hết hàng, còn " + value.stock + " đơn vị hàng"}</p>)}
                </div>
            </div>
        </div>
        <div className={styles.panel}>
            <h3>Danh sách báo cáo định kì</h3>
            <div className={styles.container}>
                {report.map((value, index) => <p key={index}>{"Ngày: " + value.date + ", doanh thu: " + value.revenue + ", lợi nhuận: " + value.profit}</p>)}
            </div>
        </div>
    </div>
}