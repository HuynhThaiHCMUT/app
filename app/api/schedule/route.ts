import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';

export async function GET(req: NextRequest) {
    const client = await clientPromise;

    if (req.nextUrl.searchParams.has("start") && req.nextUrl.searchParams.has("end")) {
        const start = req.nextUrl.searchParams.get("start") ?? "";
        const end = req.nextUrl.searchParams.get("end") ?? "";
        try {
            let data = (await client.execute("CALL GetTotalWorkingHours(?, ?)", [new Date(start), new Date(end)]))[0] as TotalWorkingHoursData[];
            return NextResponse.json(data[0]);
        }
        catch (error: any) {
            // Log the entire error for debugging
            console.error(error);

            const response: DatabaseResponse = {
                success: false,
                message: error.sqlMessage,
            };
            return NextResponse.json([]);
        }
    } else {
        const id = req.nextUrl.searchParams.get("id") ?? "-1";
        try {
            const data = (await client.execute("SELECT wid AS id, start_hour AS startHour, end_hour AS endHour FROM Working_schedule WHERE uid = ?", [parseInt(id)]))[0];
            return NextResponse.json(data);
        }
        catch (error: any) {
            console.error(error);

            return NextResponse.json([]);
        }
    }
}

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const schedule: ScheduleRequest = await req.json();

    try {
        for (const s of schedule.schedule) {
            if (s.deleted && s.id == -1) continue;
            if (s.deleted) {
                await client.execute("CALL DeleteSchedule(?)", [s.id]);
            } else {
                if (s.id == -1) {
                    await client.execute("CALL InsertSchedule(?, ?, ?)", [schedule.id, new Date(s.startHour), new Date(s.endHour)]);
                } else {
                    await client.execute("CALL UpdateSchedule(?, ?, ?)", [s.id, new Date(s.startHour), new Date(s.endHour)]);
                }
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