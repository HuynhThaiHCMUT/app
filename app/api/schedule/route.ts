import { NextRequest, NextResponse } from 'next/server';
import { clientPromise, sql } from '../db';

export async function GET(req: NextRequest) {
    const client = await clientPromise;

    //TODO: Get employee data from database

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
            return NextResponse.json(response);
        }
    } else {
        const id = req.nextUrl.searchParams.get("id") ?? "-1";
        const data = (await client.execute("SELECT start_hour AS startHour, end_hour AS endHour FROM Working_schedule WHERE uid = ?", [parseInt(id)]))[0];
        return NextResponse.json(data);
    }
}

export async function POST(req: NextRequest) {
    const client = await clientPromise;

    //TODO: Insert new employee to database

    try {
        await client.execute("")
    
        const response: DatabaseResponse = {
          success: true,
          message: '',
        };
    
        return NextResponse.json(response);
    } catch (error: any) {
        let errorMessage = 'Insert failed. ';
        console.error(error);
    
        const response: DatabaseResponse = {
            success: false,
            message: errorMessage,
        };
    
        return NextResponse.json(response);
    }
}

export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const staff: StaffData = await req.json();

    try {
        await client.execute("")

        const response: DatabaseResponse = {
            success: true,
            message: '',
        };

        return NextResponse.json(response);
    } catch (error: any) {
        let errorMessage = 'Update failed. ';

        // Log the entire error for debugging
        console.error(error);

        const response: DatabaseResponse = {
            success: false,
            message: errorMessage,
        };

        return NextResponse.json(response);
    }
}

export async function DELETE(req: NextRequest) {
    const client = await clientPromise;

    try {
        // Delete an employee from the database
        await client.execute("");

        const response: DatabaseResponse = {
            success: true,
            message: '',
        };

        return NextResponse.json(response);
    } catch (error: any) {
        let errorMessage = 'Delete failed. ';

        // Log the entire error for debugging
        console.error(error);

        const response: DatabaseResponse = {
            success: false,
            message: errorMessage,
        };

        return NextResponse.json(response);
    }
}