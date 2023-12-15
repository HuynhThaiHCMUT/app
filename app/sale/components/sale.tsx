'use client'

import styles from './sale.module.css'
import { useContext, useEffect } from 'react';
import { Context } from '../contextProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AddDialog, EditDialog } from './dialog';

export default function Sale() {
    const { q, setQ, 
        data, setData, 
        selectedProduct, selectProduct, 
        selectedInvoice, selectInvoice,
        updated, update, 
        invoice, setInvoice,
        total, setTotal,
        setShowAddDialog, setShowEditDialog, setShowDelDialog } = useContext(Context);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/product?q=${q}`, {cache: "no-store"});
            if (res.ok) {
                let products = await res.json();
                setData(products);
            }
            else console.log("Failed to fetch data");
        };
        getData();
    }, [q, updated]);

    const addInvoice = (item: ProductData) => {
        selectProduct(item);
        setShowAddDialog(true);
    }

    const editInvoice = (item: Invoice) => {
        selectInvoice(item);
        setShowEditDialog(true);
    }

    const deleteInvoice = (item: Invoice) => {
        setInvoice(invoice.filter((value: Invoice) => {
            if (value === item) return false;
            else return true;
        }));
        setTotal(total - item.total);
    }

    return <div className={styles.sale}>
        <AddDialog/>
        <EditDialog/>
        <div className={styles.productList}>
            <div className={styles.container}>
                <input className={styles.searchBar} 
                placeholder='Tìm kiếm' 
                type='search'
                value={q}
                onChange={(e) => {
                    setQ(e.target.value)
                }}/>
            </div>
            <div className={styles.productTableDiv}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.name}>Tên sản phẩm</th>
                            <th className={styles.quantity}>Số lượng</th>
                            <th className={styles.unitName}>Đơn vị</th>
                            <th className={styles.price}>Giá</th>
                            <th className={styles.add}></th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {data.map((value: ProductData) => 
                        <tr key={value.id}>
                            <td>{value.name}</td>
                            <td>{value.quantity}</td>
                            {/* <td>{value.units.map((value, index) => <p key={index}>{value.name}</p>)}</td>
                            <td>{value.units.map((value, index) => <p key={index}>{value.price}</p>)}</td> */}
                            <td>
                                <button className={styles.addButton} onClick={() => addInvoice(value)}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
        <div className={styles.invoice}>
            <p>Hoá đơn hiện tại</p>
            <div className={styles.invoiceTableDiv}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.name}>Tên sản phẩm</th>
                            <th className={styles.quantity}>Số lượng</th>
                            <th className={styles.unitName}>Đơn vị</th>
                            <th className={styles.price}>Giá</th>
                            <th className={styles.total}>Tổng</th>
                            <th className={styles.action}></th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {invoice.map((value: Invoice) => 
                        <tr key={value.product.id}>
                            <td>{value.product.name}</td>
                            <td>{value.quantity}</td>
                            <td>{value.unit.name}</td>
                            <td>{value.unit.price}</td>
                            <td>{value.total}</td>
                            <td>
                            <button className={styles.actionButton} onClick={() => editInvoice(value)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </button>
                            <button className={styles.actionButton} onClick={() => deleteInvoice(value)}>
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className={styles.invoiceFooter}>
                <p>{`Tổng cộng: ${total}`}</p>
                <button onClick={() => {
                    setInvoice([]);
                    setTotal(0);
                }}>Thanh toán</button>
                <button onClick={() => {
                    setInvoice([]);
                    setTotal(0);
                }}>Xoá tất cả</button>
            </div>
        </div>
    </div>;
}