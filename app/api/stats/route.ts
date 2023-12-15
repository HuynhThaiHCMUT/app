import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
    const client = await clientPromise;
    //start and end is Unix Epoch string
    const start = req.nextUrl.searchParams.get("start") ?? "";
    const end = req.nextUrl.searchParams.get("end") ?? "";
    const top = req.nextUrl.searchParams.get("top") ?? "";

    let data = (await client.execute("CALL GetTopSellingProductsProcedure(?, ?, ?)", [parseInt(top), new Date(parseInt(start)), new Date(parseInt(end))]))[0] as TopProductData[];

    return NextResponse.json(data[0]);
}