'use client'

import Staff from "./components/staff"
import { ContextProvider } from "./contextProvider"

export default function Page() {
    return <ContextProvider>
        <Staff/>
    </ContextProvider>
}