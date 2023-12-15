'use client'

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DisplayItem from './components/displayItem';
import { faFilter, faX } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    const [q, setQ] = useState("");
    const [tag, setTag] = useState("Tất cả");
    const [sort, setSort] = useState("");
    const [data, setData] = useState<ProductData[]>([]);
    const [category, setCategory] = useState<Category[]>([]);
    const [updated, update] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?q=${q}&tag=${tag}&sort=${sort}`, {cache: "no-store"});
            if (res.ok) {
                let products = await res.json();
                setData(products);
            }
            else console.log("Failed to fetch product data");
        };
        getData();
    }, [q, tag, updated]);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?getCategory=1`, {cache: "no-store"});
            if (res.ok) {
                let category = await res.json();
                setCategory(category);
            }
            else console.log("Failed to fetch category data");
        };
        getData();
    }, [updated]);

    return  <div className={styles.home}>
        <div className={showFilter ? styles.filterBackground : styles.hidden} onMouseDown={() => setShowFilter(false)}>
            <div className={styles.filterPanel} onMouseDown={(e) => e.stopPropagation()}>
                <div className={styles.filterHeader}>
                    <h2>Bộ lọc tìm kiếm</h2>
                    <button onMouseDown={() => setShowFilter(false)}><FontAwesomeIcon icon={faX}/></button>
                </div>
                <div className={styles.filterSection}>
                    <h3>Phân loại sản phẩm</h3>
                    <div>
                        <button
                            className={(tag == "Tất cả") ? styles.activeBox : styles.filterBox}
                            onClick={() => setTag("Tất cả")}>{"Tất cả"}</button>
                        {category.map((value, index) => 
                        <button key={index}
                            className={(tag == value.name) ? styles.activeBox : styles.filterBox}
                            onClick={() => setTag(value.name)}>{value.name}</button>)}
                    </div>
                </div>
                {/* <div className={styles.filterSection}>
                    <h3>Sắp xếp sản phẩm</h3>
                    <div>
                    {sorts.map((value, index) => 
                        <button key={index}
                            className={(sort == value) ? styles.activeBox : styles.filterBox}
                            onClick={() => setSort(value)}>{value}</button>)}
                    </div>
                </div> */}
            </div>
        </div>
        <div className={styles.container}>
            <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            value={q}
            onChange={(e) => {
                setQ(e.target.value)
            }}/>
            <button onClick={() => setShowFilter(true)}><FontAwesomeIcon icon={faFilter}/></button>
        </div>
        <div className={styles.displayList}>
        {data.map((value: ProductData) => <DisplayItem item={value} key={value.id}/>)}
        </div>
    </div>
}