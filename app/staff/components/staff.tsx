'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './staff.module.css'
import { useContext, useEffect } from 'react';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddDialog, DelDialog, EditDialog } from './dialog';
import { Context } from '../contextProvider';

export default function Staff() {
    const {q, setQ, data, setData, setShowAddDialog, setShowEditDialog, setShowDelDialog, selectedStaff, select, updated, update} = useContext(Context);
    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/staff?q=${q}`, {cache: "no-store"});
            if (!res.ok) throw new Error("Failed to fetch data");
            let staffs = await res.json();
            setData(staffs);
        };
        getData();
    }, [q, updated]);

    function editItem(p: StaffData) {
        select(p);
        setShowEditDialog(true);
    };

    function deleteItem(p: StaffData) {
        select(p);
        setShowDelDialog(true);
    };

    return <div className={styles.staff}>
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
                        <th className={styles.name}>Tên nhân viên</th>
                        <th className={styles.role}>Chức vụ</th>
                        <th className={styles.email}>Email</th>
                        <th className={styles.phone}>Số điện thoại</th>
                        <th className={styles.schedule}>Ca làm việc</th>
                        <th className={styles.action}></th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map((value: StaffData) => 
                    <tr key={value._id}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.role}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>{value.schedule.map((value, index) => <p key={index}>{value.weekDay + ": " + value.start + " - " + value.end}</p>)}</td>
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