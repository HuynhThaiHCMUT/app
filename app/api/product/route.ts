import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';

export async function GET(req: NextRequest) {
    const client = await clientPromise;

    if (req.nextUrl.searchParams.has("getCategory")) {
        const data = (await client.query("SELECT cid AS id, name FROM Category"))[0];

        return NextResponse.json(data);
    }
    else {
        const query = req.nextUrl.searchParams.get("q") ?? "";
        const category = req.nextUrl.searchParams.get("tag") ?? "";
        const sort = req.nextUrl.searchParams.get("sort") ?? "";

        let data: any[];
        if (category == "Tất cả") {
            data = (await client.execute("SELECT pid AS id, name, base_price AS basePrice, description, quantity, status FROM Product"))[0] as any[];
        } else {
            data = (await client.execute("CALL SearchProductsByCategory(?)", [category]))[0] as any[];
            data = data[0];
        }
        let filtered = data.filter((value) => (value.name.match(new RegExp(query, "i")) != null))

        let unitTable = (await client.execute("SELECT * FROM Unit"))[0] as any[];
        filtered = filtered.map((value) => {
            return {...value, units: unitTable.filter((unitValue) => unitValue.pid == value.id)};
        })
        return NextResponse.json(filtered);
    }
}

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const p: ProductData = await req.json();

    try {
        await client.execute("CALL InsertProduct(?, ?, ?, ?, ?, ?)", [p.id, p.name, p.description, p.quantity, p.status, p.basePrice]);
    
        const response: DatabaseResponse = {
          success: true,
          message: 'Successfully inserted data',
        };
    
        return NextResponse.json(response);
    } catch (error: any) {
        // Log the entire error for debugging
        console.error(error);

        const response: DatabaseResponse = {
            success: false,
            message: error.sqlMessage,
        };

        return NextResponse.json(response);
    }
}

export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const p: ProductData = await req.json();

    try {
        await client.execute("CALL UpdateProduct(?, ?, ?, ?, ?, ?)", [p.id, p.name, p.description, p.quantity, p.status, p.basePrice]);
    
        const response: DatabaseResponse = {
          success: true,
          message: 'Successfully updated data',
        };
    
        return NextResponse.json(response);
    } catch (error: any) {
        // Log the entire error for debugging
        console.error(error);

        const response: DatabaseResponse = {
            success: false,
            message: error.sqlMessage,
        };

        return NextResponse.json(response);
    }
}

export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const id = req.nextUrl.searchParams.get("d") ?? "";

    try {
        // Delete an employee from the database
        await client.execute("CALL DeleteProduct(?)", [parseInt(id)]);

        const response: DatabaseResponse = {
            success: true,
            message: 'Successfully deleted product',
        };

        return NextResponse.json(response);
    } catch (error: any) {
        // Log the entire error for debugging
        console.error(error);

        const response: DatabaseResponse = {
            success: false,
            message: error.sqlMessage,
        };

        return NextResponse.json(response);
    }
}