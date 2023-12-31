'use client'

import { SetStateAction, useEffect, useState } from 'react';
import styles from './page.module.css'
import FlatPickr from 'react-flatpickr'
    
import 'flatpickr/dist/themes/light.css';   
       
export default function Statistic() {
    const [top, setTop] = useState(10);
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [stockData,setStockData] = useState<OutOfStockProduct[]>([]);
    const [topData, setTopData] = useState<TopProductData[]>([]);
    const [profitData, setProfitData] = useState<ProfitData[]>([]);
    const [sumRev, setSumRev] = useState(0);
    const [sumProf, setSumProf] = useState(0);
    const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>('outOfStock');
    const [updated, update] = useState(false);

    // Các mục trong sidebar
    const sidebarItems = [
        { label: 'Danh sách sản phẩm hết hàng', id: 'outOfStock' },
        { label: 'Danh sách sản phẩm bán chạy', id: 'topProduct' },
        { label: 'Báo cáo lợi nhuận', id: 'profitReport' },
    ];
        
    useEffect(() => {
        async function getTopData() {
            let res = await fetch(`/api/stats?func=top&top=${top}&start=${start.getTime().toString()}&end=${end.getTime().toString()}`, {cache: "no-store"});
            if (res.ok) {
                let products: TopProductData[] = await res.json();
                setTopData(products);
            }
            else console.log("Failed to fetch data");
        };
        async function getStockData() {
            try {
                const res = await fetch('/api/stats?func=stock', { cache: 'no-store' });
                if (res.ok) {
                    let outOfStockProducts: OutOfStockProduct[] = await res.json();
                    if (outOfStockProducts && outOfStockProducts.length > 0) {
                        setStockData(outOfStockProducts);
                    } else console.log('Empty or invalid data received from the API');
                } else console.log('Failed to fetch out-of-stock data. Status:', res.status);
            } catch (error) {
                console.error('Error fetching out-of-stock data:', error);
            }
        };
        async function getProfitData() {
            let res = await fetch(`/api/stats?func=profit&top=${top}&start=${start.getTime().toString()}&end=${end.getTime().toString()}`, {cache: "no-store"});
            if (res.ok) {
                let profit: ProfitResponse = await res.json();
                setProfitData(profit.data);
                setSumRev(profit.sumRev);
                setSumProf(profit.sumProf);
            }
            else console.log("Failed to fetch data");
        };
        getTopData();
        getStockData();
        getProfitData();
    }, [updated]);

    return (
        <div className={styles.pageContainer}>
          {/* Sidebar */}
          <div className={styles.sidebarSection}>
            <div className={styles.sidebarTitle}><p>Thống kê cửa hàng</p></div>
            <div className={styles.sidebar}>
              <ul>
                {sidebarItems.map((item) => (
                  <li key={item.id} onClick={() => handleSidebarItemClick(item.id)}>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
    
          {/* Main Content */}
          <div className={styles.mainContent}>{renderContent()}</div>
        </div>
      );
    function handleSidebarItemClick(itemId: string) {
        setSelectedSidebarItem(itemId);
    }

    function renderContent() {
        switch (selectedSidebarItem) {
            case 'outOfStock':
                return renderOutOfStockContent();
            case 'topProduct':
                return renderTopProductContent();
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
           
              <div  className={styles.display}>
                <div className={styles.fw500}>
                  <p>STT</p>
                  <p>Tên sản phẩm</p>
                  <p>Số lượng trong kho</p>
                </div>
                {stockData.map((value, index) => (
                  <div key={index}>
                    <p>{index + 1}</p>
                    <p>{value.name}</p>
                    <p>{value.quantity}</p>
                  </div>
                ))}
              </div>
          </div>
        );
      }
    

    function renderTopProductContent() {
        return (
          <div className={styles.salesReport}>
            <p>Danh sách top sản phẩm bán chạy</p>
            <div className={styles.salesReportContainer}>
              <div className={styles.salesReportInput}>
                <p>Ngày bắt đầu</p>
                <FlatPickr value={start} onChange={([date]) => setStart(date)} />
              </div>
              <div className={styles.salesReportInput}>
                <p>Ngày kết thúc</p>
                <FlatPickr value={end} onChange={([date]) => setEnd(date)} />
              </div>
              <div className={styles.salesReportInput}>
                <p>Top</p>
                <input
                  type="number"
                  value={top}
                  onChange={(e) => setTop(parseInt(e.target.value))}
                />
              </div>
              <button onClick={() => update(!updated)}>Tìm kiếm</button>
            </div>
            <div className={styles.display}>
              <div className={styles.stickyHeader}>
                <p>STT</p>
                <p>Tên sản phẩm</p>
                <p>Số lượng bán</p>
              </div>
              
              {topData.map((value, index) => (
                <div key={index}>
                  <p>{index + 1}</p>
                  <p>{value.name}</p>
                  <p>{value.totalSold}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }

    function renderProfitReportContent() {
        return (
          <div className={styles.profitReport}>
            <p>Báo cáo lợi nhuận</p>
            <div className={styles.salesReportContainer}>
              <div className={styles.salesReportInput}>
                <p>Ngày bắt đầu</p>
                <FlatPickr value={start} onChange={([date]) => setStart(date)} />
              </div>
              <div className={styles.salesReportInput}>
                <p>Ngày kết thúc</p>
                <FlatPickr value={end} onChange={([date]) => setEnd(date)} />
              </div>
              <button onClick={() => update(!updated)}>Tìm kiếm</button>
            </div>
            <div className={styles.profitDisplay}>
              <div className={styles.profitHeader}>
                <p>STT</p>
                <p>Tên sản phẩm</p>
                <p>Số lượng bán</p>
                <p>Doanh thu</p>
                <p>Lợi nhuận</p>
              </div>
              
              {profitData.map((value, index) => (
                <div key={index}>
                  <p>{index + 1}</p>
                  <p>{value.name}</p>
                  <p>{value.totalSold}</p>
                  <p>{value.revenue}</p>
                  <p>{value.profit}</p>
                </div>
              ))}

              <div className={styles.profitHeader}>
                <p></p>
                <p>Tổng :</p>
                <p></p>
                <p>{sumRev}</p>
                <p>{sumProf}</p>
              </div>

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
        
