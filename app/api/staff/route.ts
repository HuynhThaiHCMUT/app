import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../db';
import { Filter, ObjectId} from 'mongodb';

export async function GET(req: NextRequest) {
    const client = await clientPromise;
    const q = req.nextUrl.searchParams.get("q")?.replace(/[^A-Za-z0-9\s]/g, "") ?? "";
    let regex = `.*${q.split(" ").map((value) => `(.*${value}.*)`).join("&")}.*`;
    const query: Filter<any>[] = [{
        $search: {
            index: "name",
            regex: {
                query: regex,
                allowAnalyzedField: true,
                path: "name"
            }
        }
    }]
    let data = await client.db("AppData").collection("StaffData").aggregate(query).sort({name: 1}).toArray();
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const p = await req.json();
    let data = await client.db("AppData").collection("StaffData").insertOne(p);
    let res: DatabaseResponse;
    if (data.acknowledged) {
        res = {
            success: true,
            message: "Thêm nhân viên thành công"
        }
    }
    else res = {
        success: false,
        message: "Thêm nhân viên thất bại"
    }
    return NextResponse.json(res);
}

export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const reqBody = await req.json();
    let data = await client.db("AppData").collection("StaffData").replaceOne({_id: new ObjectId(reqBody.key)}, reqBody.body);
    let res: DatabaseResponse;
    if (data.modifiedCount > 0) {
        res = {
            success: true,
            message: "Sửa nhân viên thành công"
        }
    }
    else res = {
        success: false,
        message: "Sửa nhân viên thất bại"
    }
    return NextResponse.json(res);
}

export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const id = req.nextUrl.searchParams.get("d") ?? "";
    let data = await client.db("AppData").collection("StaffData").deleteOne({_id: new ObjectId(id)});
    let res: DatabaseResponse;
    if (data.deletedCount > 0) {
        res = {
            success: true,
            message: "Xoá nhân viên thành công"
        }
    }
    else res = {
        success: false,
        message: "Xoá nhân viên thất bại"
    }
    return NextResponse.json(res);
}