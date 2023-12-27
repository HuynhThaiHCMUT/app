import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '../db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const invoice: Invoice[] = await req.json();
    let sum = 0;
    try {
        const result = await client.execute("INSERT INTO Order_table (status, date) VALUES (?, ?)", ["Đã xử lí", new Date()]) as ResultSetHeader[];
        const oid = result[0].insertId;

        for (const i of invoice) {
            sum += i.total;
            client.execute("INSERT INTO Order_include (pid, unit_name, oid, quantity, price) VALUES (?, ?, ?, ?, ?)", [i.product.id, i.unit.name, oid, i.quantity, i.unit.price])
        }

        client.execute("UPDATE Order_table SET sum_total = ? WHERE oid = ?", [sum, oid]);

        return NextResponse.json({success: true, message: "Success"})
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({success: false, message: error.sqlMessage})
    }
}