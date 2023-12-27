'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { CldUploadButton } from 'next-cloudinary';

function parseInt(s: string): number {
    return (s === "") ? 0 : Number.parseInt(s);
}

function AddDialog() {
    const {showAddDialog, setShowAddDialog, updated, update} = useContext(Context);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [quantity, setQuantity] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [units, setUnits] = useState<UnconvertedUnit[]>([]);

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setId("");
        setName("");
        setDesc("");
        setQuantity("");
        setBasePrice("");
        setUnits([{
            name: "",
            price: "",
            weight: ""
        }]);
    }, [showAddDialog])

    useEffect(() => {
        async function addProduct(req: ProductData) {
            let res = await fetch(`/api/product`, {method: "POST", body: JSON.stringify(req)});
            if (!res.ok) setMessage("Internal server error")
            else {
                let dbres: DatabaseResponse = await res.json();
                if (dbres.success) {
                    setTimeout(() => update(!updated), 1000);
                    setShowAddDialog(false);
                    setMessage("");
                }
                else {
                    setMessage(dbres.message);
                }
            }
        };
        if (confirmed) {
            let req: ProductData = {
                id: parseInt(id),
                name: name,
                description: desc,
                quantity: parseInt(quantity),
                status: parseInt(quantity) <= 0 ? "Hết hàng" : (parseInt(quantity) <= 10) ? "Sắp hết hàng" : "Còn hàng",
                basePrice: parseInt(basePrice),
                units: units.map((value) => {
                    return {
                        name: value.name,
                        price: parseInt(value.price),
                        weight: parseInt(value.weight),
                        image: value.image
                    }
                })
            } 
            addProduct(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showAddDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowAddDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Thêm sản phẩm</h2>
            <p className={styles.message}>{message}</p>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên sản phẩm</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Mô tả sản phẩm</p>
            <input type='text'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}/>
            <p>Số lượng</p>
            <input type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}/>
            <p>Trạng thái: {parseInt(quantity) <= 0 ? "Hết hàng" : (parseInt(quantity) <= 10) ? "Sắp hết hàng" : "Còn hàng"} </p>
            <p>Giá gốc</p>
            <input type='number'
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}/>
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
                weight: ""
            }])}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                }}>Xác nhận</button>
                <button onClick={() => setShowAddDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function EditDialog() {
    const {selectedProduct, showEditDialog, setShowEditDialog, updated, update} = useContext(Context);
    
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [quantity, setQuantity] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [units, setUnits] = useState<UnconvertedUnit[]>([]);

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setId(selectedProduct.id.toString());
        setName(selectedProduct.name);
        setDesc(selectedProduct.description);
        setQuantity(selectedProduct.quantity.toString());
        setBasePrice(selectedProduct.basePrice.toString());
        setUnits(selectedProduct.units.map((value: Unit) => {
            return {
                name: value.name,
                price: value.price.toString(),
                weight: value.weight.toString()
            }
        }));
    }, [showEditDialog])

    useEffect(() => {
        async function editProduct(req: ProductData) {
            let res = await fetch(`/api/product`, {method: "PUT", body: JSON.stringify(req)});
            if (!res.ok) setMessage("Internal server error")
            else {
                let dbres: DatabaseResponse = await res.json();
                if (dbres.success) {
                    update(!updated);
                    setShowEditDialog(false);
                    setMessage("");
                }
                else {
                    setMessage(dbres.message);
                }
            }
        };
        if (confirmed) {
            let req: ProductData = {
                id: parseInt(id),
                name: name,
                description: desc,
                quantity: parseInt(quantity),
                status: parseInt(quantity) <= 0 ? "Hết hàng" : (parseInt(quantity) <= 10) ? "Sắp hết hàng" : "Còn hàng",
                basePrice: parseInt(basePrice),
                units: units.map((value) => {
                    return {
                        name: value.name,
                        price: parseInt(value.price),
                        weight: parseInt(value.weight),
                        image: value.image
                    }
                })
            } 
            editProduct(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Sửa sản phẩm</h2>
            <p className={styles.message}>{message}</p>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên sản phẩm</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Mô tả sản phẩm</p>
            <input type='text'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}/>
            <p>Số lượng</p>
            <input type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}/>
            <p>Trạng thái: {parseInt(quantity) <= 0 ? "Hết hàng" : (parseInt(quantity) <= 10) ? "Sắp hết hàng" : "Còn hàng"} </p>
            <p>Giá gốc</p>
            <input type='number'
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}/>
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
                    <p>Trọng số</p>
                    <input type='number'
                    value={value.weight}
                    onChange={(e) => setUnits(units.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, weight: e.target.value} : subValue))}/>
                </div>
                <CldUploadButton 
                className={styles.upload}
                uploadPreset="next-unsigned"
                onUpload={(result, widget) => {
                    if (value.image) {
                        fetch(`/api/image?id=${value.image}`)
                    }
                    setUnits(units.map((subValue, subIndex) => 
                    (index === subIndex) ? {...subValue, image: (result?.info as any).public_id} : subValue))
                    widget.close();
                }}/>
                <button className={styles.remove} onClick={() => setUnits(units.filter((v, i) => (i != index)))}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
                
            </div>)}
            <button onClick={() => setUnits([...units, {
                name: "",
                price: "",
                weight: ""
            }])}>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                }}>Xác nhận</button>
                <button onClick={() => setShowEditDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function DelDialog() {
    const {selectedProduct, showDelDialog, setShowDelDialog, updated, update} = useContext(Context);
    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function deleteProduct() {
            let res = await fetch(`/api/product?d=${selectedProduct.id}`, {method: "DELETE"});
            if (!res.ok) setMessage("Internal server error")
            else {
                let dbres: DatabaseResponse = await res.json();
                if (dbres.success) {
                    update(!updated);
                    setShowDelDialog(false);
                    setMessage("");
                }
                else {
                    setMessage(dbres.message);
                }
            }
        };
        if (confirmed) {
            deleteProduct();
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showDelDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowDelDialog(false)}>
        <div className={styles.delDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Xác nhận xoá sản phẩm ?</h2>
            <p className={styles.message}>{message}</p>
            <p>{selectedProduct.name}</p>
            <div className={styles.buttonContainer}>
                <button onClick={() => {
                    confirm(true);
                }}>Xác nhận</button>
                <button onClick={() => setShowDelDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

export {AddDialog, EditDialog, DelDialog};