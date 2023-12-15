'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './staff.module.css'
import { useContext, useEffect } from 'react';
import { faCalendar, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddDialog, DelDialog, EditDialog, SumDialog, ViewDialog } from './dialog';
import { Context } from '../contextProvider';

export default function Staff() {
    const {q, setQ, data, setData, setShowSumDialog, setShowViewDialog, setShowAddDialog, setShowEditDialog, setShowDelDialog, selectedStaff, select, updated, update} = useContext(Context);
    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/staff?q=${q}`, {cache: "no-store"});
            if (res.ok) {
                let staff = await res.json();
                setData(staff);
            }
            else console.log("Failed to fetch data");
        };
        getData();
    }, [q, updated]);

    function viewItem(p: StaffData) {
        select(p);
        setShowViewDialog(true);
    }

    function editItem(p: StaffData) {
        select(p);
        setShowEditDialog(true);
    };

    function deleteItem(p: StaffData) {
        select(p);
        setShowDelDialog(true);
    };

    return <div className={styles.staff}>
        <SumDialog/>
        <ViewDialog/>
        <AddDialog/>
        <EditDialog/>
        <DelDialog/>
        <div className={styles.container}>
            <input className={styles.searchBar} 
            placeholder='Tìm kiếm' 
            type='search'
            value={q}
            onChange={(e) => {
                setQ(e.target.value)
            }}/>
            <button onClick={() => setShowAddDialog(true)}>Thêm nhân viên</button>
            <button onClick={() => setShowSumDialog(true)}>Tổng giờ làm</button>
        </div>
        <div className={styles.tableDiv}>
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr>
                        <th className={styles.id}>ID</th>
                        <th className={styles.lname}>Họ</th>
                        <th className={styles.fname}>Tên</th>
                        <th className={styles.role}>Chức vụ</th>
                        <th className={styles.email}>Email</th>
                        <th className={styles.phone}>Số điện thoại</th>
                        <th className={styles.birthday}>Ngày sinh</th>
                        <th className={styles.action}></th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map((value: StaffData) => 
                    <tr key={value.id}>
                        <td>{value.id}</td>
                        <td>{value.lname}</td>
                        <td>{value.fname}</td>
                        <td>{value.role}</td>
                        <td>{value.email}</td>
                        <td>{value.phone}</td>
                        <td>{(new Date(Date.parse(value.birthday.toString()))).toLocaleDateString()}</td>
                        <td>
                            <button onClick={() => viewItem(value)}>
                                <FontAwesomeIcon icon={faCalendar}/>
                            </button>
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