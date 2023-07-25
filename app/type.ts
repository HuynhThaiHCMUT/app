type Unit = {
    name: string,
    price: number,
    basePrice: number,
    weight: number
}

type ProductData = {
    id: number,
    name: string,
    quantity: number,
    units: Unit[]
}