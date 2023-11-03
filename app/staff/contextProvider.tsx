import { ReactNode, createContext, useState } from 'react';

const Context = createContext<any | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [q, setQ] = useState("");
    const [data, setData] = useState<StaffData[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDelDialog, setShowDelDialog] = useState(false);
    const [selectedStaff, select] = useState<StaffData>({
        _id: "",
        id: 0,
        name: "",
        role: "",
        email: "",
        phone: "",
        schedule: []
    });
    const [updated, update] = useState(false);

    return (
    <Context.Provider value={
        { q, setQ, 
        data, setData, 
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