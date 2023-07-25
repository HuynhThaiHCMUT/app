import { ReactNode, createContext, useState } from 'react';

const Context = createContext<any | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [q, setQ] = useState("");
    const [data, setData] = useState<ProductData[]>();
    const [showDelDialog, setShowDelDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedProduct, select] = useState<ProductData>();

    return (
    <Context.Provider value={
        { q, setQ, 
        data, setData, 
        showDelDialog, setShowDelDialog, 
        showEditDialog, setShowEditDialog,
        selectedProduct, select }}>
        {children}
    </Context.Provider>
    );
};

export { Context, ContextProvider };