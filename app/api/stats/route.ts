import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
    const client = await clientPromise;
    const func = req.nextUrl.searchParams.get("func") ?? "";
    const start = req.nextUrl.searchParams.get("start") ?? "";
    const end = req.nextUrl.searchParams.get("end") ?? "";
    const top = req.nextUrl.searchParams.get("top") ?? "";

    try {
        let data;
        switch (func) {
            case "top":
                data = (await client.execute("CALL GetTopSellingProductsProcedure(?, ?, ?)", [parseInt(top), new Date(parseInt(start)), new Date(parseInt(end))]))[0] as TopProductData[];

                return NextResponse.json(data[0]);
            case "outofstock":
                data = (await client.execute("CALL GetLowQuantityProducts()" ))[0]as OutOfStockProduct[];

                return NextResponse.json(data[0]);
            case "profit":

                return NextResponse.json([]);
        }
    } catch (error: any) {
        console.log(error);

        return NextResponse.json([])
    }
}