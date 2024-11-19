import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const GHN_API_URL = process.env.GHN_API_URL;
const GHN_API_KEY = process.env.GHN_API_KEY;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;

export async function GET(request: Request) {
    try {
        const body = await request.json();

        const response = await fetch(`${GHN_API_URL}shipping-order/fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': GHN_API_KEY as string,
                'ShopId': GHN_SHOP_ID as string,
            },
            body: JSON.stringify({
                from_district_id: body.from_district_id,
                from_ward_code: body.from_ward_code,
                service_id: body.service_id,
                service_type_id: body.service_type_id,
                to_district_id: body.to_district_id,
                to_ward_code: body.to_ward_code,
                height: body.height,
                length: body.length,
                weight: body.weight,
                width: body.width,
                insurance_value: body.insurance_value,
                coupon: body.coupon
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({
                message: errorData.message,
                data: null
            }, {
                status: 500
            })
        }

        const data = await response.json();
        return NextResponse.json({
            message: 'Calculate fee successfully',
            data: data.data
        }, {
            status: 200
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: 'Internal server error',
            data: null
        }, {
            status: 500
        })
    }
}
