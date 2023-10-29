'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './store.module.css'
import { useContext, useEffect } from 'react';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddDialog, DelDialog, EditDialog } from './dialog';
import { Context } from '../contextProvider';

export default function Store() {
    const {q, setQ, data, setData, setShowAddDialog, setShowEditDialog, setShowDelDialog, selectedProduct, select, updated, update} = useContext(Context);
    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?q=${q}`, {cache: "no-store"});
            if (!res.ok) throw new Error("Failed to fetch data");
            let products = await res.json();
            setData(products);
        };
        getData();
    }, [q, updated]);

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
        <div className={styles.container}>
            <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            value={q}
            onChange={(e) => {
                setQ(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))
            }}/>
            <button onClick={() => setShowAddDialog(true)}>Thêm sản phẩm</button>
        </div>
        <div className={styles.tableDiv}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th className={styles.id}>ID</th>
                        <th className={styles.name}>Tên sản phẩm</th>
                        <th className={styles.quantity}>Số lượng</th>
                        <th className={styles.unitName}>Đơn vị</th>
                        <th className={styles.price}>Giá</th>
                        <th className={styles.basePrice}>Giá gốc</th>
                        <th className={styles.weight}>Trọng số</th>
                        <th className={styles.action}></th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map((value: ProductData) => 
                    <tr key={value._id}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.quantity}</td>
                        <td>{value.units.map((value, index) => <p key={index}>{value.name}</p>)}</td>
                        <td>{value.units.map((value, index) => <p key={index}>{value.price}</p>)}</td>
                        <td>{value.units.map((value, index) => <p key={index}>{value.basePrice}</p>)}</td>
                        <td>{value.units.map((value, index) => <p key={index}>{value.weight}</p>)}</td>
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