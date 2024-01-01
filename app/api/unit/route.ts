import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const unit: UnitRequest = await req.json();

    console.log(unit);

    try {
        for (const u of unit.units) {
            if (u.deleted && u.changed) continue;
            if (u.deleted) {
                await client.execute("CALL DeleteUnit(?, ?)", [unit.id, u.name]);
            } else if (u.changed) {
                const old = (await client.execute("SELECT * FROM Unit Where pid = ? AND name = ?", [unit.id, u.name]))[0] as any;
                if (old.image) {
                    fetch(`/api/image?id=${old.image}}`)
                }
                await client.execute("CALL UpdateUnit(?, ?, ?, ?, ?)", [unit.id, u.name, u.price, u.weight, u.image ?? ""]);
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