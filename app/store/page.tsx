'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react';

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

    return <div className={styles.store}>
        <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            onChange={(e) => setQ(e.target.value)}/>
        {data.map((value) => <p>Name: {value.name}</p>)}
    </div>;
}   