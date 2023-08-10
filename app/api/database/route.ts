import { NextRequest, NextResponse } from 'next/server';
import clientPromise from './db';
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
    let data = await client.db("AppData").collection("ProductData").aggregate(query).sort({name: 1}).toArray();
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const p = await req.json();
    let res = await client.db("AppData").collection("ProductData").insertOne(p);
    return NextResponse.json(res);
}

export async function PUT(req: NextRequest) {
    const client = await clientPromise;
    const reqBody = await req.json();
    let res = await client.db("AppData").collection("ProductData").replaceOne({_id: new ObjectId(reqBody.key)}, reqBody.body);
    return NextResponse.json(res);
}

export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const id = req.nextUrl.searchParams.get("d") ?? "";
    let res = await client.db("AppData").collection("ProductData").deleteOne({_id: new ObjectId(id)});
    return NextResponse.json(res);
}