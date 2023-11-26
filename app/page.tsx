'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayItem from './components/displayItem';
import { faFilter, faX } from '@fortawesome/free-solid-svg-icons';

const tags = ["Đồ uống", "Sữa", "Bánh", "Bột giặt", "Vệ sinh cá nhân", "Khác"];
const sorts = ["Giá tăng", "Giá giảm"]

export default function Home() {
    const [q, setQ] = useState("");
    const [tag, setTag] = useState("");
    const [sort, setSort] = useState("");
    const [data, setData] = useState<ProductData[]>([]);
    const [updated, update] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?q=${q}&tag=${tag}&sort=${sort}`, {cache: "no-store"});
            if (!res.ok) throw new Error("Failed to fetch data");
            let products = await res.json();
            setData(products);
        };
        getData();
    }, [q, updated]);

    return  <div>
        <div className={showFilter ? styles.filterBackground : styles.hidden} onMouseDown={() => setShowFilter(false)}>
            <div className={styles.filterPanel} onMouseDown={(e) => e.stopPropagation()}>
                <div className={styles.filterHeader}>
                    <h2>Bộ lọc tìm kiếm</h2>
                    <button onMouseDown={() => setShowFilter(false)}><FontAwesomeIcon icon={faX}/></button>
                </div>
                <div className={styles.filterSection}>
                    <h3>Phân loại sản phẩm</h3>
                    <div>
                        {tags.map((value, index) => 
                        <button key={index}
                            className={(tag == value) ? styles.activeBox : styles.filterBox}
                            onClick={() => setTag(value)}>{value}</button>)}
                    </div>
                </div>
                <div className={styles.filterSection}>
                    <h3>Sắp xếp sản phẩm</h3>
                    <div>
                    {sorts.map((value, index) => 
                        <button key={index}
                            className={(sort == value) ? styles.activeBox : styles.filterBox}
                            onClick={() => setSort(value)}>{value}</button>)}
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.container}>
            <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            value={q}
            onChange={(e) => {
                setQ(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))
            }}/>
            <button onClick={() => setShowFilter(true)}><FontAwesomeIcon icon={faFilter}/></button>
        </div>
        <div className={styles.home}>
        {data.map((value: ProductData) => <DisplayItem item={value} key={value._id}/>)}
        </div>
    </div>
}