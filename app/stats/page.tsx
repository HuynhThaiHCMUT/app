'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import FlatPickr from 'react-flatpickr'

import 'flatpickr/dist/themes/light.css';

export default function Statistic() {
    const [top, setTop] = useState(10);
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());

    const [data, setData] = useState<TopProductData[]>([]);
    const [updated, update] = useState(false);

    useEffect(() => {
        async function getData() {
            console.log(`/api/stats?top=${top}&start=${start.getTime().toString()}&end=${end.getTime().toString()}`);
            let res = await fetch(`/api/stats?top=${top}&start=${start.getTime().toString()}&end=${end.getTime().toString()}`, {cache: "no-store"});
            if (res.ok) {
                let products: TopProductData[] = await res.json();
                setData(products);
            }
            else console.log("Failed to fetch data");
        };
        getData();
    }, [updated]);


    return <div className={styles.stats}>
        <div className={styles.inputContainer}>
            <div>
                <p>Ngày bắt đầu</p>
                <FlatPickr value={start} onChange={([date]) => setStart(new Date(date.getTime() - (date.getTimezoneOffset() * 60000)))}/>
            </div>
            <div>
                <p>Ngày kết thúc</p>
                <FlatPickr value={end} onChange={([date]) => setEnd(new Date(date.getTime() - (date.getTimezoneOffset() * 60000)))}/>
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
}