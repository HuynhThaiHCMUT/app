import { ReactNode, createContext, useState } from 'react';

const Context = createContext<any | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [q, setQ] = useState("");
    const [data, setData] = useState<ProductData[]>([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showUnitDialog, setShowUnitDialog] = useState(false);
    const [showDelDialog, setShowDelDialog] = useState(false);
    const [selectedProduct, select] = useState<ProductData>({
        id: 0,
        name: "",
        description: "",
        quantity: 0,
        status: "",
        basePrice: 0,
        units: []
    });
    const [updated, update] = useState(false);

    return (
    <Context.Provider value={
        { q, setQ, 
        data, setData, 
        showAddDialog, setShowAddDialog,
        showEditDialog, setShowEditDialog,
        showUnitDialog, setShowUnitDialog,
        showDelDialog, setShowDelDialog, 
        selectedProduct, select,
        updated, update}}>
        {children}
    </Context.Provider>
    );
};

export { Context, ContextProvider };