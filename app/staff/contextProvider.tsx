import { ReactNode, createContext, useState } from 'react';

const Context = createContext<any | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [q, setQ] = useState("");
    const [data, setData] = useState<StaffData[]>([]);
    const [showSumDialog, setShowSumDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDelDialog, setShowDelDialog] = useState(false);
    const [selectedStaff, select] = useState<StaffData>({
        id: 0,
        fname: "",
        lname: "",
        role: "",
        email: "",
        phone: "",
        birthday: new Date(Date.now())
    });
    const [updated, update] = useState(false);

    return (
    <Context.Provider value={
        { q, setQ, 
        data, setData, 
        showSumDialog, setShowSumDialog,
        showViewDialog, setShowViewDialog,
        showAddDialog, setShowAddDialog,
        showEditDialog, setShowEditDialog,
        showDelDialog, setShowDelDialog, 
        selectedStaff, select,
        updated, update}}>
        {children}
    </Context.Provider>
    );
};

export { Context, ContextProvider };