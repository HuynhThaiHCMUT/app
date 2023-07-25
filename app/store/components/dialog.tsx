'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import { DeleteResult } from 'mongodb';

function EditDialog({p}: {p: ProductData}) {
    const {showEditDialog, setShowEditDialog} = useContext(Context);
    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onClick={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onClick={(e) => e.stopPropagation()}>

        </div>
    </div>;
}

function DelDialog({p}: {p: ProductData}) {
    const {showDelDialog, setShowDelDialog} = useContext(Context);
    const [confirmed, confirm] = useState(false);
    const firstRender = useRef(true);

    if (p == undefined) {
        p = {
            id: 0,
            name: "",
            quantity: 0,
            units: []
        }
    } 

    useEffect(() => {
        async function deleteProduct() {
            let res = await fetch(`database?d=${p.id}`, {method: "DELETE"});
            if (!res.ok) throw new Error("Failed to delete product");
            let dbres: DeleteResult = await res.json();
            if (dbres.deletedCount > 0) {
                console.log("Xoá sản phẩm thành công");
            }
            else {
                console.log("Xoá sản phẩm thất bại");
            }
        };
        if (!firstRender.current && confirmed) {
            deleteProduct();
            confirm(false);
        }
        else {
            firstRender.current = false;
        }
    }, [confirmed]);

    return <div className={showDelDialog ? styles.dialogBackground : styles.hidden} onClick={() => setShowDelDialog(false)}>
        <div className={styles.delDialog} onClick={(e) => e.stopPropagation()}>
            <h1>Xác nhận xoá sản phẩm ?</h1>
            <p>{p.name}</p>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                    setTimeout(() => setShowDelDialog(false), 100);
                }}>Xác nhận</button>
                <button onClick={() => setShowDelDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

export {DelDialog, EditDialog};