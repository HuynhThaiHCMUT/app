'use client'

import Store from "./components/store"
import { ContextProvider } from "./contextProvider"

export default function Page() {
    return <ContextProvider>
        <Store/>
    </ContextProvider>
}