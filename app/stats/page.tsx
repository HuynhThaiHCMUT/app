'use client'

import { SetStateAction, useEffect, useState } from 'react';
import styles from './page.module.css'
import FlatPickr from 'react-flatpickr'
    
import 'flatpickr/dist/themes/light.css';   
       
export default function Statistic() {
    const [top, setTop] = useState(10);
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    
    const [data, setData] = useState<TopProductData[]>([]);
    const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>('outOfStock');
    const [updated, update] = useState(false);

    // Các mục trong sidebar
    const sidebarItems = [
        { label: 'Danh sách sản phẩm hết hàng', id: 'outOfStock' },
        { label: 'Danh sách sản phẩm đã bán', id: 'salesReport' },
        { label: 'Báo cáo lợi nhuận', id: 'profitReport' },
    ];
        
    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/stats?top=${top}&start=${start.getTime().toString()}&end=${end.getTime().toString()}`, {cache: "no-store"});
            if (res.ok) {
                let products: TopProductData[] = await res.json();
                setData(products);
            }
            else console.log("Failed to fetch data");
        };
        getData();
    }, [updated]);
    
    return (
        <div className={styles.pageContainer}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
                <ul>
                    {sidebarItems.map(item => (
                        <li key={item.id} onClick={() => handleSidebarItemClick(item.id)}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Main Content */}
            <div className={styles.mainContent}>
                {renderContent()}
            </div>
        </div>
    );

    function handleSidebarItemClick(itemId: string) {
        setSelectedSidebarItem(itemId);
    }

    function renderContent() {
        switch (selectedSidebarItem) {
            case 'outOfStock':
                return renderOutOfStockContent();
            case 'salesReport':
                return renderSalesReportContent();
            case 'profitReport':
                return renderProfitReportContent();
            default:
                return null;
        }
    }

    function renderOutOfStockContent() {
        return (
            <div className={styles.outOfStock}>
                <p>Danh sách sản phẩm hết hàng</p>
            </div>
        );
    }

    function renderSalesReportContent() {
        return (
            <div className={styles.salesReport}>
                    <p>Danh sách sản phẩm đã bán</p>
                    <div className={styles.salesReportContainer}>
                    <div>
                        <p>Ngày bắt đầu</p>
                        <FlatPickr value={start} onChange={([date]) => setStart(date)}/>
                    </div>
                    <div>
                        <p>Ngày kết thúc</p>
                        <FlatPickr value={end} onChange={([date]) => setEnd(date)}/>
                    </div>
                    <div>
                        <p>Top</p>
                        <input type='number' value={top} onChange={(e) => setTop(parseInt(e.target.value))}/>
                    </div>
                    <button onClick={() => update(!updated)}>
                        Tìm kiếm
                    </button>
                </div>
                <div className={styles.display}>
                     <div>
                        <p>STT</p>
                        <p>Tên sản phẩm</p>
                        <p>Số lượng bán</p>
                    </div>
                    {data.map((value, index) => <div key={index}>
                        <p>{index + 1}</p>
                        <p>{value.name}</p>
                        <p>{value.totalSold}</p>
                    </div>)}
                    </div>
                </div>
        );
    }

    function renderProfitReportContent() {
        return (
            <div className={styles.profitReport}>
                <p>Báo cáo lợi nhuận</p>
                <div className={styles.profitReportContainer}>
                    <div>
                        <p>Ngày bắt đầu</p>
                        <FlatPickr value={start} onChange={([date]) => setStart(date)}/>
                    </div>
                    <div>
                        <p>Ngày kết thúc</p>
                        <FlatPickr value={end} onChange={([date]) => setEnd(date)}/>
                    </div>
                        <button onClick={() => update(!updated)}>
                        Tìm kiếm
                        </button>
                </div>
            </div>
        );
    }
}
            // return <div className={styles.stats}>
            //     <div className={styles.inputContainer}>
            //         <div>
            //             <p>Ngày bắt đầu</p>
            //             <FlatPickr value={start} onChange={([date]) => setStart(date)}/>
            //         </div>
            //         <div>
            //             <p>Ngày kết thúc</p>
            //             <FlatPickr value={end} onChange={([date]) => setEnd(date)}/>
            //         </div>
            //         <div>
            //             <p>Top</p>
            //             <input type='number' value={top} onChange={(e) => setTop(parseInt(e.target.value))}/>
            //         </div>
            //         <button onClick={() => update(!updated)}>
            //             Tìm kiếm
            //         </button>
            //     </div>
            //     <div className={styles.display}>
            //         <div>
            //             <p>STT</p>
            //             <p>Tên sản phẩm</p>
            //             <p>Số lượng bán</p>
            //         </div>
            //         {data.map((value, index) => <div key={index}>
            //             <p>{index + 1}</p>
            //             <p>{value.name}</p>
            //             <p>{value.totalSold}</p>
            //         </div>)}
            //     </div>
            // </div>
        
