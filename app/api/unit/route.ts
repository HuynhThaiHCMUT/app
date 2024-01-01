import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const unit: UnitRequest = await req.json();

    try {
        for (const u of unit.units) {
            if (u.deleted && u.changed) continue;
            if (u.deleted) {
                try {
                    await client.execute("CALL DeleteUnit(?, ?)", [unit.id, u.name]);
                } catch (error: any) {
                    console.error(error);
                
                    if (error.sqlState == 53001) continue
                    else return NextResponse.json({
                        success: false,
                        message: error.sqlMessage,
                    });
                }
            } else if (u.changed) {
                const old = (await client.execute("SELECT * FROM Unit Where pid = ? AND name = ?", [unit.id, u.name]))[0] as any;

                if (old[0] && old[0].image && old[0].image != u.image) {
                    fetch(`${req.nextUrl.protocol}//${req.nextUrl.host}/api/image?id=${old[0].image}`);
                }
                await client.execute("CALL UpdateUnit(?, ?, ?, ?, ?, ?)", [unit.id, u.name, u.price, u.weight, u.active, u.image ?? ""]);
                //await client.execute("UPDATE Unit SET active = true WHERE pid = ? AND name = ?", [unit.id, u.name]);
            }
        }
    
        const response: DatabaseResponse = {
          success: true,
          message: 'Update successfully',
        };
    
        return NextResponse.json(response);
    } catch (error: any) {
        console.error(error);
    
        const response: DatabaseResponse = {
            success: false,
            message: error.sqlMessage,
        };
    
        return NextResponse.json(response);
    }
}