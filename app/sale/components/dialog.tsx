'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { use, useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

function parseInt(s: string): number {
    return (s === "") ? 0 : Number.parseInt(s);
}

function AddDialog() {
    const {selectedProduct, showAddDialog, setShowAddDialog, invoice, setInvoice, total, setTotal} = useContext(Context);
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState(0);

    useEffect(() => {
        setQuantity("");
        setUnit(0);
    }, [showAddDialog])

    function addInvoice() {
        setInvoice([...invoice, {
            product: selectedProduct,
            quantity: parseInt(quantity),
            unit: selectedProduct.units[unit],
            total: parseInt(quantity)*selectedProduct.units[unit].price
        }]);
        setTotal(total + parseInt(quantity)*selectedProduct.units[unit].price)
    }

    return <div className={showAddDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowAddDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Thêm hoá đơn</h2>
            <p>{selectedProduct.name}</p>
            <div>
                <div>
                    <p>Số lượng</p>
                    <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                </div>
                <div>
                    <p>Đơn vị</p>
                    <select value={unit} onChange={(e) => setUnit(Number.parseInt(e.target.value))}>
                        {selectedProduct.units.map((value: Unit, index: number) => <option key={index} value={index}>
                            {`${value.name}: ${value.price}`}
                        </option>)}
                    </select>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    addInvoice();
                    setShowAddDialog(false);
                }}>Xác nhận</button>
                <button onClick={() => setShowAddDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function EditDialog() {
    const {selectedInvoice, showEditDialog, setShowEditDialog, invoice, setInvoice, total, setTotal} = useContext(Context);
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState(0);

    useEffect(() => {
        setQuantity(selectedInvoice.quantity.toString());
        setUnit(selectedInvoice.product.units.indexOf(selectedInvoice.unit));
    }, [showEditDialog])

    function editInvoice() {
        setInvoice(invoice.map((value: Invoice, index: number) => {
            if (value === selectedInvoice) {
                return {
                    product: selectedInvoice.product,
                    quantity: parseInt(quantity),
                    unit: selectedInvoice.product.units[unit],
                    total: parseInt(quantity)*selectedInvoice.product.units[unit].price
                }
            }
            else {
                return value;
            }
        }));
        setTotal(total - selectedInvoice.total + parseInt(quantity)*selectedInvoice.product.units[unit].price)
    }

    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Thêm hoá đơn</h2>
            <p>{selectedInvoice.product.name}</p>
            <div>
                <div>
                    <p>Số lượng</p>
                    <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                </div>
                <div>
                    <p>Đơn vị</p>
                    <select value={unit} onChange={(e) => setUnit(Number.parseInt(e.target.value))}>
                        {selectedInvoice.product.units.map((value: Unit, index: number) => <option key={index} value={index}>
                            {`${value.name}: ${value.price}`}
                        </option>)}
                    </select>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    editInvoice();
                    setShowEditDialog(false);
                }}>Xác nhận</button>
                <button onClick={() => setShowEditDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function ConfirmDialog() {
    const {showConfirmDialog, setShowConfirmDialog, invoice, setInvoice, total, setTotal} = useContext(Context);
    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
    }, [showConfirmDialog])

    useEffect(() => {
        async function postInvoice(req: Invoice[]) {
            let res = await fetch(`/api/sale`, {method: "POST", body: JSON.stringify(req)});
            if (!res.ok) setMessage("Internal server error")
            else {
                let dbres: DatabaseResponse = await res.json();
                if (dbres.success) {
                    setInvoice([]);
                    setTotal(0);
                    setShowConfirmDialog(false);
                    setMessage("");
                }
                else {
                    setMessage(dbres.message);
                }
            }
        };
        if (confirmed) {
            postInvoice(invoice);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showConfirmDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowConfirmDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Xác nhận thanh toán?</h2>
            <p className={styles.message}>{message}</p>
            <p>{`Tổng cộng: ${total}`}</p>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                }}>Xác nhận</button>
                <button onClick={() => setShowConfirmDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

export {AddDialog, EditDialog, ConfirmDialog};