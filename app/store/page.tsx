'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';

type Unit = {
    name: string,
    price: number,
    basePrice: number,
    weight: number
}

type ProductData = {
    id: number,
    name: string,
    quantity: number,
    units: Unit[]
}

export default function Store() {
    const [q, setQ] = useState("");
    const any: any[] = [{}];
    const [data, setData] = useState(any);
    useEffect(() => {
        async function getData() {
            let res = await fetch(`http://localhost:3000/database?q=${q}`, {cache: "no-store"});
            if (!res.ok) throw new Error("Failed to fetch data");
            let w = await res.json();
            setData(w);
        };
        getData();
    }, [q]);

    const editItem = (p: ProductData) => {
        
        return undefined;
    }

    const deleteItem = (p: ProductData) => {
        return undefined;
    }

    return <div className={styles.store}>
        <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            value={q}
            onChange={(e) => {
                setQ(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))
            }}/>
        <table className={styles.table}>
            <thead className={styles.tableHeader}>
                <tr>
                    <th className={styles.id}>ID</th>
                    <th className={styles.name}>Tên sản phẩm</th>
                    <th className={styles.quantity}>Số lượng</th>
                    <th className={styles.unitName}>Tên đơn vị</th>
                    <th className={styles.price}>Giá</th>
                    <th className={styles.basePrice}>Giá gốc</th>
                    <th className={styles.weight}>Trọng số</th>
                    <th className={styles.action}></th>
                </tr>
            </thead>
            <tbody className={styles.tableBody}>
                {(data[0] == undefined || data[0].id == undefined) ? <></> : data.map((value: ProductData) => 
                <tr key={value.id}>
                    <td>{value.id}</td>
                    <td>{value.name}</td>
                    <td>{value.quantity}</td>
                    <td>{value.units.map((value, index) => <p key={index}>{value.name}</p>)}</td>
                    <td>{value.units.map((value, index) => <p key={index}>{value.price}</p>)}</td>
                    <td>{value.units.map((value, index) => <p key={index}>{value.basePrice}</p>)}</td>
                    <td>{value.units.map((value, index) => <p key={index}>{value.weight}</p>)}</td>
                    <td>
                        <button onClick={editItem(value)}>
                            <FontAwesomeIcon icon={faPen}/>
                        </button>
                        <button onClick={deleteItem(value)}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </div>;
}   