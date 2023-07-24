import { NextRequest, NextResponse } from 'next/server';
import clientPromise from './db';
import { Filter } from 'mongodb';

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
    let data = await client.db("AppData").collection("ProductData").aggregate(query).toArray();
    return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
    return NextResponse.json({name: "POSTING"});
}