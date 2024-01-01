import { NextRequest, NextResponse } from 'next/server';
import { clientPromise } from '../db';

export async function GET(req: NextRequest) {
    const client = await clientPromise;

    try {
        // Gọi procedure và lấy dữ liệu từ kết quả truy vấn
        let data = (await client.execute("CALL GetLowQuantityProducts()" ),[])[0]as OutOfStockProduct[];

        // Trả về dữ liệu dưới dạng JSON
        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error(error);

        // Xử lý lỗi và trả về một phản hồi JSON trống nếu có lỗi
        return NextResponse.json([]);
    }
}
