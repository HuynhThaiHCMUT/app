import { ReactNode, createContext, useState } from 'react';

const Context = createContext<any | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [q, setQ] = useState("");
    const [data, setData] = useState<ProductData[]>([]);
    const [selectedProduct, selectProduct] = useState<ProductData>({
        _id: "",
        id: 0,
        name: "",
        quantity: 0,
        units: [{
            name: "",
            price: 0,
            basePrice: 0,
            weight: 0
        }]
    });
    const [selectedInvoice, selectInvoice] = useState<Invoice>({
        product: {
            _id: "",
            id: 0,
            name: "",
            quantity: 0,
            units: [{
                name: "",
                price: 0,
                basePrice: 0,
                weight: 0
            }]
        },
        quantity: 0,
        unit: {
            name: "",
            price: 0,
            basePrice: 0,
            weight: 0
        },
        total: 0
    });
    const [updated, update] = useState(false);
    const [invoice, setInvoice] = useState<Invoice[]>([]);
    const [total, setTotal] = useState(0);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDelDialog, setShowDelDialog] = useState(false);

    return (
    <Context.Provider value={
        { q, setQ, 
        data, setData, 
        selectedProduct, selectProduct,
        selectedInvoice, selectInvoice,
        updated, update,
        invoice, setInvoice,
        total, setTotal,
        showAddDialog, setShowAddDialog,
        showEditDialog, setShowEditDialog,
        showDelDialog, setShowDelDialog }}>
        {children}
    </Context.Provider>
    );
};

export { Context, ContextProvider };