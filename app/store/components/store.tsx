'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './store.module.css'
import { useContext, useEffect, useState } from 'react';
import { faFilter, faPen, faX, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddDialog, DelDialog, EditDialog } from './dialog';
import { Context } from '../contextProvider';

export default function Store() {
    const {q, setQ, data, setData, setShowAddDialog, setShowEditDialog, setShowDelDialog, selectedProduct, select, updated, update} = useContext(Context);
    const [tag, setTag] = useState("Tất cả");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState<Category[]>([]);
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

    function editItem(p: ProductData) {
        select(p);
        setShowEditDialog(true);
    };

    function deleteItem(p: ProductData) {
        select(p);
        setShowDelDialog(true);
    };

    return <div className={styles.store}>
        <AddDialog/>
        <EditDialog/>
        <DelDialog/>
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
            <button onClick={() => setShowAddDialog(true)}>Thêm sản phẩm</button>
            <button onClick={() => setShowFilter(true)}><FontAwesomeIcon icon={faFilter}/></button>
        </div>
        <div className={styles.tableDiv}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th className={styles.id}>ID</th>
                        <th className={styles.name}>Tên sản phẩm</th>
                        <th className={styles.quantity}>Số lượng</th>
                        <th className={styles.weight}>Trạng thái</th>
                        <th className={styles.basePrice}>Giá gốc</th>
                        <th className={styles.action}></th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map((value: ProductData) => 
                    <tr key={value.id}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.quantity}</td>
                        <td>{value.status}</td>
                        <td>{value.basePrice}</td>
                        <td>
                            <button onClick={() => editItem(value)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </button>
                            <button onClick={() => deleteItem(value)}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>;
}