'use client'

import styles from './dialog.module.css'
import { Context } from '../contextProvider'
import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import FlatPickr from 'react-flatpickr'

import 'flatpickr/dist/themes/light.css';

function parseInt(s: string): number {
    return (s === "") ? 0 : Number.parseInt(s);
}

function SumDialog() {
    const {showSumDialog, setShowSumDialog, updated, update} = useContext(Context);
    const [start, setStart] = useState<Date>(new Date())
    const [end, setEnd] = useState<Date>(new Date())
    const [data, setData] = useState<TotalWorkingHoursData[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => setMessage(""), [showSumDialog]);

    useEffect(() => {
        async function getData() {
            let res = await fetch(`/api/schedule?start=${start}&end=${end}`, {cache: "no-store"});
            if (res.ok) {
                let list = await res.json();

                if (message in list) {
                    setMessage(list.message);
                } else {
                    setData(list);
                    console.log(list);
                }
            }
            else console.log("Failed to fetch data");
        };
        getData();
    }, [start, end]);

    return <div className={showSumDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowSumDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Tính tổng giờ làm của nhân viên</h2>
            <p className={styles.message}>{message}</p>
            <div className={styles.scheduleContainer}>
                <div>
                    <p>Từ ngày</p>
                    <FlatPickr
                    value={start} 
                    onChange={([date]) => setStart(date)}/>
                </div>
                <div>
                    <p>Đến ngày</p>
                    <FlatPickr
                    value={end} 
                    onChange={([date]) => setEnd(date)}/>
                </div>
            </div>
            <div className={styles.tableDiv}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.id}>ID</th>
                            <th className={styles.lname}>Họ</th>
                            <th className={styles.fname}>Tên</th>
                            <th className={styles.role}>Chức vụ</th>
                            <th className={styles.totalHours}>Tổng giờ</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {data.map((value: TotalWorkingHoursData) => 
                        <tr key={value.id}>
                            <td>{value.id}</td>
                            <td>{value.lname}</td>
                            <td>{value.fname}</td>
                            <td>{value.role}</td>
                            <td>{value.totalHours}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => setShowSumDialog(false)}>OK</button>
            </div>
        </div>
    </div>;
}

function ViewDialog() {
    const {showViewDialog, setShowViewDialog, updated, update, selectedStaff} = useContext(Context);
    const [data, setData] = useState<Schedule[]>([]);
    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getSchedule() {
            let res = await fetch(`/api/schedule?id=${selectedStaff.id}`, {cache: "no-store"});
            if (res.ok) {
                let schedule = await res.json();
                setData(schedule);
            }
            else console.log("Failed to fetch data");
        };
        setMessage("");
        getSchedule();
    }, [showViewDialog]);

    useEffect(() => {
        async function postSchedule(changedSchedule: ScheduleRequest) {
            let res = await fetch(`/api/schedule`, {method: "POST", body: JSON.stringify(changedSchedule)});
            if (res.ok) {
                let dbres: DatabaseResponse = await res.json();
                if (dbres.success) {
                    setTimeout(() => update(!updated), 1000);
                    setShowViewDialog(false);
                    setMessage("");
                }
                else {
                    setMessage(dbres.message);
                }
            }
            else setMessage("Internal server error");
        };
        if (confirmed) {
            let changedSchedule = {
                id: selectedStaff.id,
                schedule: data.filter((value) => value.changed)
            }

            postSchedule(changedSchedule);
            confirm(false);
        } 
    }, [confirmed]);

    return <div className={showViewDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowViewDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Lịch làm việc của nhân viên</h2>
            <p className={styles.message}>{message}</p>
            {data.map((value, index) => (!value.deleted) ? <div key={index} className={styles.scheduleContainer}>
            <div>
                <p>Bắt đầu</p>
                <FlatPickr data-enable-time
                value={value.startHour} 
                onChange={([date]) => setData(data.map((subValue, subIndex) => 
                    (index === subIndex) ? {...subValue, startHour: date, changed: true} : subValue))}/>
            </div>
            <div>
                <p>Kết thúc</p>
                <FlatPickr data-enable-time
                value={value.endHour} 
                onChange={([date]) => setData(data.map((subValue, subIndex) => 
                    (index === subIndex) ? {...subValue, endHour: date, changed: true} : subValue))}/>
            </div>
            <button onClick={() => setData(data.map((subValue, subIndex) => 
                    (index === subIndex) ? {...subValue, changed: true, deleted: true} : subValue))}>
                <FontAwesomeIcon icon={faXmark}/>
            </button>
            </div> : <></>)}
            <button onClick={() => setData([...data, {
                id: -1,
                startHour: new Date(),
                endHour: new Date(),
                changed: true
            }])}>
                <p>Thêm lịch làm việc</p>
                <FontAwesomeIcon icon={faPlus}/>
            </button>
            <div className={styles.buttonContainer}>
                <button onClick={() => confirm(true)}>Xác nhận</button>
                <button onClick={() => setShowViewDialog(false)}>Huỷ</button>
            </div>
        </div>
    </div>;
}

function AddDialog() {
    const {showAddDialog, setShowAddDialog, updated, update} = useContext(Context);

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState<Date>(new Date());

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
        setFName("");
        setLName("");
        setRole("");
        setEmail("");
        setPhone("");
        setBirthday(new Date());
    }, [showAddDialog])

    useEffect(() => {
        async function addStaff(req: StaffData) {
            let res = await fetch(`/api/staff`, {method: "POST", body: JSON.stringify(req)});
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
            
            let req: StaffData = {
                id: 0,
                fname: fname,
                lname: lname,
                role: role,
                email: email,
                phone: phone,
                birthday: birthday,
            }
            addStaff(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showAddDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowAddDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Thêm nhân viên</h2>
            <p className={styles.message}>{message}</p>
            <div className={styles.nameContainer}>
                <div>
                    <p>Họ</p>
                    <input type='text'
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}/>
                </div>
                <div>
                    <p>Tên</p>
                    <input type='text'
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}/>
                </div>
            </div>
            <p>Chức vụ</p>
            <input type='text'
            value={role}
            onChange={(e) => setRole(e.target.value)}/>
            <p>Email</p>
            <input type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
            <p>Số điện thoại</p>
            <input type='number'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}/>
            <p>Ngày sinh</p>
            <FlatPickr
            value={birthday} 
            onChange={([date]) => setBirthday(date)}/>
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

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState<Date>(new Date());

    const [confirmed, confirm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
        setFName(selectedStaff.fname);
        setLName(selectedStaff.lname);
        setRole(selectedStaff.role);
        setEmail(selectedStaff.email);
        setPhone(selectedStaff.phone);
        setBirthday(selectedStaff.birthday);
    }, [showEditDialog])

    useEffect(() => {
        async function editStaff(req: StaffData) {
            let res = await fetch(`/api/staff`, {method: "PUT", body: JSON.stringify(req)});
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
            
            let req: StaffData = {
                id: selectedStaff.id,
                fname: fname,
                lname: lname,
                role: role,
                email: email,
                phone: phone,
                birthday: birthday,
            }
            editStaff(req);
            confirm(false);
        }
    }, [confirmed]);

    return <div className={showEditDialog ? styles.dialogBackground : styles.hidden} onMouseDown={() => setShowEditDialog(false)}>
        <div className={styles.editDialog} onMouseDown={(e) => e.stopPropagation()}>
            <h2>Sửa nhân viên</h2>
            <p className={styles.message}>{message}</p>
            <div className={styles.nameContainer}>
                <div>
                    <p>Họ</p>
                    <input type='text'
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}/>
                </div>
                <div>
                    <p>Tên</p>
                    <input type='text'
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}/>
                </div>
            </div>
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
            <p>Ngày sinh</p>
            <FlatPickr
            value={birthday} 
            onChange={([date]) => setBirthday(date)}/>
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

    useEffect(() => setMessage(""), [showDelDialog])

    useEffect(() => {
        async function deleteStaff() {
            let res = await fetch(`/api/staff?d=${selectedStaff.id}`, {method: "DELETE"});
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

export {SumDialog, ViewDialog, AddDialog, EditDialog, DelDialog};