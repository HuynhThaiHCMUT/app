type Unit = {
    name: string,
    price: number,
    basePrice: number,
    weight: number
}

type UnconvertedUnit = {
    name: string,
    price: string,
    basePrice: string,
    weight: string
}

type ProductData = {
    _id: string,
    id: number,
    name: string,
    quantity: number,
    units: Unit[]
}

type NewProductData = {
    id: number,
    name: string,
    quantity: number,
    units: Unit[]
}

type PutReqBody = {
    key: string,
    body: NewProductData
}

type Invoice = {
    product: ProductData,
    quantity: number,
    unit: Unit,
    total: number
}