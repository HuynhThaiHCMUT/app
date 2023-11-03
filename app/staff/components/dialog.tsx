'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { useContext, useEffect, useState } from 'react'
import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { setegid } from 'process';

function parseInt(s: string): number {
    return (s === "") ? 0 : Number.parseInt(s);
}

function AddDialog() {
    const {showAddDialog, setShowAddDialog, updated, update} = useContext(Context);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [schedule, setSchedule] = useState<Schedule[]>([]);

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setId("");
        setName("");
        setRole("");
        setEmail("");
        setPhone("");
        setSchedule([{
            weekDay: "",
            start: "",
            end: ""
        }]);
    }, [showAddDialog])

    useEffect(() => {
        async function addStaff(req: NewStaffData) {
            let res = await fetch(`/api/staff`, {method: "POST", body: JSON.stringify(req)});
            if (!res.ok) throw new Error("Failed to add staff");
            let dbres: DatabaseResponse = await res.json();
            if (dbres.success) {
                setTimeout(() => update(!updated), 1000);
                setShowAddDialog(false);
                setMessage("");
            }
            else {
                setMessage(dbres.message);
            }
        };
        if (confirmed) {
            
            let req: NewStaffData = {
                id: parseInt(id),
                name: name,
                role: role,
                email: email,
                phone: phone,
                schedule: schedule,
            } 
            addStaff(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showAddDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowAddDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Thêm nhân viên</h2>
            <p className={styles.message}>{message}</p>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên nhân viên</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Chức vụ</p>
            <input type='text'
            value={role}
            onChange={(e) => setRole(e.target.value)}/>
            <p>Email</p>
            <input type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            <p>Số điện thoại</p>
            <input type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}/>
            {schedule.map((value, index) => <div key={index} className={styles.unitContainer}>
                <div>
                    <p>Thứ</p>
                    <input type='text'
                    value={value.weekDay}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, weekDay: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Bắt đầu</p>
                    <input type='text'
                    value={value.start}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, start: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Kết thúc</p>
                    <input type='text'
                    value={value.end}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, end: e.target.value} : subValue))}/>
                </div>
                {(index != 0) ? <button onClick={() => setSchedule(schedule.filter((v, i) => (i != index)))}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button> : <></>}
            </div>)}
            <button onClick={() => setSchedule([...schedule, {
                weekDay: "",
                start: "",
                end: "",
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
    const {selectedStaff, showEditDialog, setShowEditDialog, updated, update} = useContext(Context);

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [schedule, setSchedule] = useState<Schedule[]>([]);

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setId(selectedStaff.id);
        setName(selectedStaff.name);
        setRole(selectedStaff.role);
        setEmail(selectedStaff.email);
        setPhone(selectedStaff.phone);
        setSchedule(selectedStaff.schedule);
    }, [showEditDialog])

    useEffect(() => {
        async function editStaff(req: PutStaffRequestBody) {
            let res = await fetch(`/api/staff`, {method: "PUT", body: JSON.stringify(req)});
            if (!res.ok) throw new Error("Failed to edit staff");
            let dbres: DatabaseResponse = await res.json();
            if (dbres.success) {
                update(!updated);
                setShowEditDialog(false);
                setMessage("");
            }
            else {
                setMessage(dbres.message);
            }
        };
        if (confirmed) {
            let req: PutStaffRequestBody = {
                key: selectedStaff._id,
                body: {
                    id: parseInt(id),
                    name: name,
                    role: role,
                    email: email,
                    phone: phone,
                    schedule: schedule,
                }
            } 
            editStaff(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Sửa nhân viên</h2>
            <p className={styles.message}>{message}</p>
            <p>ID</p>
            <input type='number'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <p>Tên nhân viên</p>
            <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}/>
            <p>Chức vụ</p>
            <input type='text'
            value={role}
            onChange={(e) => setRole(e.target.value)}/>
            <p>Email</p>
            <input type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            <p>Số điện thoại</p>
            <input type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}/>
            {schedule.map((value, index) => <div key={index} className={styles.unitContainer}>
                <div>
                    <p>Thứ</p>
                    <input type='text'
                    value={value.weekDay}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, weekDay: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Bắt đầu</p>
                    <input type='text'
                    value={value.start}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, start: e.target.value} : subValue))}/>
                </div>
                <div>
                    <p>Kết thúc</p>
                    <input type='text'
                    value={value.end}
                    onChange={(e) => setSchedule(schedule.map((subValue, subIndex) => 
                        (index === subIndex) ? {...subValue, end: e.target.value} : subValue))}/>
                </div>
                {(index != 0) ? <button onClick={() => setSchedule(schedule.filter((v, i) => (i != index)))}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button> : <></>}
            </div>)}
            <button onClick={() => setSchedule([...schedule, {
                weekDay: "",
                start: "",
                end: "",
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
    const {selectedStaff, showDelDialog, setShowDelDialog, updated, update} = useContext(Context);
    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function deleteStaff() {
            let res = await fetch(`/api/staff?d=${selectedStaff._id}`, {method: "DELETE"});
            if (!res.ok) throw new Error("Failed to delete product");
            let dbres: DatabaseResponse = await res.json();
            if (dbres.success) {
                update(!updated);
                setShowDelDialog(false);
                setMessage("");
            }
            else {
                setMessage(dbres.message);
            }
        };
        if (confirmed) {
            deleteStaff();
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showDelDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowDelDialog(false)}>
        <div className={styles.delDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Xác nhận xoá nhân viên ?</h2>
            <p className={styles.message}>{message}</p>
            <p>{selectedStaff.name}</p>
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