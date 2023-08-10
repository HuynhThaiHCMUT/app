'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

function parseInt(s: string): number {
    return (s === "") ? 0 : Number.parseInt(s);
}

function AddDialog() {
    const {showAddDialog, setShowAddDialog, updated, update} = useContext(Context);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [units, setUnits] = useState<UnconvertedUnit[]>([]);

    const [confirmed, confirm] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        setId("");
        setName("");
        setQuantity("");
        setUnits([]);
    }, [showAddDialog])

    useEffect(() => {
        async function addProduct(req: NewProductData) {
            let res = await fetch(`/api/database`, {method: "POST", body: JSON.stringify(req)});
            if (!res.ok) throw new Error("Failed to add product");
            let dbres: InsertOneResult = await res.json();
            if (dbres.acknowledged) {
                console.log("Thêm sản phẩm thành công");
                setTimeout(() => update(!updated), 1000);
            }
            else {
                console.log("Thêm sản phẩm thất bại");
            }
        };
        if (!firstRender.current && confirmed) {
            let req: NewProductData = {
                id: parseInt(id),
                name: name,
                quantity: parseInt(quantity),
                units: units.map((value) => {
                    return {
                        name: value.name,
                        price: parseInt(value.price),
                        basePrice: parseInt(value.basePrice),
                        weight: parseInt(value.weight)
                    }
                })
            } 
            addProduct(req);
            confirm(false);
        }
        else {
            firstRender.current = false;
        }
    }, [confirmed]);

    return <div className={showAddDialog ? styles.dialogBackground : styles.hidden} onClick={() => setShowAddDialog(false)}>
        <div className={styles.editDialog} onClick={(e) => e.stopPropagation()}>
            <h1>Thêm sản phẩm</h1>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên sản phẩm</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Số lượng</p>
            <input type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}/>
            {units.map((value, index) => <div key={index} className={styles.unitContainer}>
                <div>
                    <p>Tên đơn vị</p>
                    <input type='text'
                    value={value.name}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, name: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Giá</p>
                    <input type='number'
                    value={value.price}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, price: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Giá gốc</p>
                    <input type='number'
                    value={value.basePrice}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, basePrice: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Trọng số</p>
                    <input type='number'
                    value={value.weight}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, weight: e.target.value} : subValue))}/>
                </div>
                <button onClick={() => setUnits(units.filter((v, i) => (i != index)))}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </div>)}
            <button onClick={() => setUnits([...units, {
                name: "",
                price: "",
                basePrice: "",
                weight: ""
            }])}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                    setShowAddDialog(false);
                }}>Xác nhận</button>
                <button onClick={() => setShowAddDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function EditDialog({p}: {p: ProductData}) {
    const {showEditDialog, setShowEditDialog, updated, update} = useContext(Context);

    if (p == undefined) {
        p = {
            _id: "",
            id: 0,
            name: "",
            quantity: 0,
            units: []
        }
    } 

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [units, setUnits] = useState<UnconvertedUnit[]>([]);

    const [confirmed, confirm] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        setId(p.id.toString());
        setName(p.name);
        setQuantity(p.quantity.toString());
        setUnits(p.units.map((value) => {
            return {
                name: value.name,
                price: value.price.toString(),
                basePrice: value.basePrice.toString(),
                weight: value.weight.toString()
            }
        }));
    }, [showEditDialog])

    useEffect(() => {
        async function editProduct(req: PutReqBody) {
            let res = await fetch(`/api/database`, {method: "PUT", body: JSON.stringify(req)});
            if (!res.ok) throw new Error("Failed to edit product");
            let dbres: UpdateResult = await res.json();
            if (dbres.modifiedCount > 0) {
                console.log("Sửa sản phẩm thành công");
                update(!updated);
            }
            else {
                console.log("Sửa sản phẩm thất bại");
            }
        };
        if (!firstRender.current && confirmed) {
            let req: PutReqBody = {
                key: p._id,
                body: {
                    id: parseInt(id),
                    name: name,
                    quantity: parseInt(quantity),
                    units: units.map((value) => {
                        return {
                            name: value.name,
                            price: parseInt(value.price),
                            basePrice: parseInt(value.basePrice),
                            weight: parseInt(value.weight)
                        }
                    })
                }
            } 
            editProduct(req);
            confirm(false);
        }
        else {
            firstRender.current = false;
        }
    }, [confirmed]);

    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onClick={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onClick={(e) => e.stopPropagation()}>
            <h1>Sửa sản phẩm</h1>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên sản phẩm</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Số lượng</p>
            <input type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}/>
            {units.map((value, index) => <div key={index} className={styles.unitContainer}>
                <div>
                    <p>Tên đơn vị</p>
                    <input type='text'
                    value={value.name}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, name: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Giá</p>
                    <input type='number'
                    value={value.price}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, price: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Giá gốc</p>
                    <input type='number'
                    value={value.basePrice}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, basePrice: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Trọng số</p>
                    <input type='number'
                    value={value.weight}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, weight: e.target.value} : subValue))}/>
                </div>
                <button onClick={() => setUnits(units.filter((v, i) => (i != index)))}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </div>)}
            <button onClick={() => setUnits([...units, {
                name: "",
                price: "",
                basePrice: "",
                weight: ""
            }])}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                    setShowEditDialog(false);
                }}>Xác nhận</button>
                <button onClick={() => setShowEditDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function DelDialog({p}: {p: ProductData}) {
    const {showDelDialog, setShowDelDialog, updated, update} = useContext(Context);
    const [confirmed, confirm] = useState(false);
    const firstRender = useRef(true);

    if (p == undefined) {
        p = {
            _id: "",
            id: 0,
            name: "",
            quantity: 0,
            units: []
        }
    } 

    useEffect(() => {
        async function deleteProduct() {
            let res = await fetch(`/api/database?d=${p._id}`, {method: "DELETE"});
            if (!res.ok) throw new Error("Failed to delete product");
            let dbres: DeleteResult = await res.json();
            if (dbres.deletedCount > 0) {
                console.log("Xoá sản phẩm thành công");
                update(!updated);
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
                    setShowDelDialog(false);
                }}>Xác nhận</button>
                <button onClick={() => setShowDelDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

export {AddDialog, EditDialog, DelDialog};