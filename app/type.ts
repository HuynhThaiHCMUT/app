type Unit = {
    name: string,
    price: number,
    weight: number,
    image?: string
}

type UnconvertedUnit = {
    name: string,
    price: string,
    weight: string,
    image?: string
}

type ProductData = {
    id: number,
    name: string,
    description: string,
    quantity: number,
    basePrice: number,
    status: string,
    units: Unit[]
}

type Category = {
    id: number,
    name: string
}

type Invoice = {
    product: ProductData,
    quantity: number,
    unit: Unit,
    total: number
}

type Schedule = {
    id: number,
    startHour: Date,
    endHour: Date,
    changed?: boolean,
    deleted?: boolean
}

type ScheduleRequest = {
    id: number,
    schedule: Schedule[]
}

type StaffData = {
    id: number,
    fname: string,
    lname: string,
    role: string,
    email: string,
    phone: string,
    birthday: Date | string,
    //schedule: Schedule[]
}

type TotalWorkingHoursData = {
    id: number,
    fname: string,
    lname: string,
    role: string,
    totalHours: number
}

type OutOfStockProduct = {
    name:string,
    quantity:number
}

type TopProductData = {
    id: number,
    name: string,
    totalSold: number
}

type DatabaseResponse = {
    success: boolean,
    message: string
}