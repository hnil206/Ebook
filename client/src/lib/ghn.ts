import { Ghn } from 'giaohangnhanh';
import { CreateOrder } from 'giaohangnhanh/lib/order';


const ghn = new Ghn({
    token: process.env.GHN_API_TOKEN as string,
    shopId: Number(process.env.GHN_SHOP_ID as string),
    host: process.env.GHN_API_URL as string,
    trackingHost: process.env.GHN_TRACKING_URL as string,
    testMode: true,
});

export default ghn;

export const createOrderGHN = async (
    {order , districtId, wardCode, provinceId}: 
    {order: any, districtId: number, wardCode: string, provinceId?: number}
    ): Promise<any> => {
    const payload: CreateOrder = {
        payment_type_id: order.paymentMethod === 'cod' ? 2 : 1,
        note: `Order #${order.id}`,
        required_note: "KHONGCHOXEMHANG",
        from_name: process.env.GHN_SHOP_NAME as string,
        from_phone: process.env.GHN_SHOP_PHONE as string,
        from_address: process.env.GHN_SHOP_ADDRESS as string,
        from_ward_name: process.env.GHN_SHOP_WARD as string,
        from_district_name: process.env.GHN_SHOP_DISTRICT as string,
        from_province_name: process.env.GHN_SHOP_PROVINCE as string,
        return_phone: process.env.GHN_SHOP_PHONE as string,
        return_address: process.env.GHN_SHOP_ADDRESS as string,
        return_district_id: null,
        return_ward_code: "",
        client_order_code: order.id.toString(),
        to_name: order.name,
        to_phone: order.phone,
        to_address: order.shipAddress,
        to_ward_code: wardCode, // You need to implement a function to get this from the order address
        to_district_id: districtId, // You need to implement a function to get this from the order address
        cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
        content: `Order #${order.id}`,
        weight: 200, // You might want to calculate this based on the order items
        length: 10,
        width: 10,
        height: 10,
        pick_station_id: 0,
        insurance_value: Math.round(order.total),
        service_id: 0,
        service_type_id: 2,
        coupon: null,
        pick_shift: [2],
        items: order.orderItems.map((item: any) => ({
            name: item.product?.name || 'Custom Bracelet',
            code: item.product?.id.toString() || item.customBracelet?.id.toString(),
            quantity: item.quantity,
            price: Math.round(item.subtotal / item.quantity),
            length: 10,
            width: 10,
            height: 10,
            weight: 200, // You might want to get this from the product data
            category: {
                level1: "Jewelry"
            }
        }))
    };

    return ghn.order.createOrder(payload);
}

export const getOrderInfoGHN = async (orderCode: string) => {
    return ghn.order.orderInfo({ order_code: orderCode });
}
export async function calculateShippingFee({
    to_province_id,
    to_district_id,
    to_ward_code,
    weight,
    length,
    width,
    height,
    insurance_value,
    service_id,
    coupon
}: {
    to_province_id: number;
    to_district_id: number;
    to_ward_code: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    insurance_value: number;
    service_id?: number;
    coupon?: string;
}) {
    const payload = {
        to_province_id,
        to_district_id,
        to_ward_code,
        service_type_id: null,
        weight,
        length,
        width,
        height,
        insurance_value,
        cod_failed_amount: 100000,
        from_district_id: parseInt(process.env.GHN_SHOP_DISTRICT_ID as string),
        from_ward_code: process.env.GHN_SHOP_WARD_CODE as string,
        // from_province_id: parseInt(process.env.GHN_SHOP_PROVINCE_ID || '0', 10),
        service_id: 53321,
        coupon: null,
    };

    console.log(payload, 'payload');

    const response = await fetch(`${process.env.GHN_API_URL}shipping-order/fee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Token': process.env.GHN_API_TOKEN as string,
            'ShopId': process.env.GHN_SHOP_ID as string,
        },
        body: JSON.stringify(payload),
    });

    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to calculate shipping fee: ${errorData.message || response.statusText}`);
    }
    
    const {data} = await response.json();
    return data.total;
}


export const returnAddressCodeGHN = async ({ district, ward, province = 'Đà Nẵng' }: { district: string; ward: string; province?: string }) => {

    try {
        // Get province ID (Đà Nẵng has provinceID 48)
        const provinceId = 203;

        // Get districts for Đà Nẵng
        const districts = await ghn.address.getDistricts(provinceId);

        // Find the matching district
        const matchedDistrict = districts.find(d => d.DistrictName.toLowerCase() === district.toLowerCase());
        if (!matchedDistrict) {
            throw new Error(`District "${district}" not found in ${province}`);
        }

        // Get wards for the matched district
        const wards = await ghn.address.getWards(matchedDistrict.DistrictID);

        // Find the matching ward
        const matchedWard = wards.find(w => w.WardName.toLowerCase() === ward.toLowerCase());
        if (!matchedWard) {
            throw new Error(`Ward "${ward}" not found in district "${district}"`);
        }

        return {
            provinceId,
            districtId: matchedDistrict.DistrictID,
            wardCode: matchedWard.WardCode
        };
    } catch (error) {
        console.error('Error in returnAddressCode:', error);
        throw error;
    }
};


export const getProvinces = async () => {
    return ghn.address.getProvinces();
  };
  
  export const getDistricts = async (provinceId: number) => {
    return ghn.address.getDistricts(provinceId);
  };
  
  export const getWards = async (districtId: number) => {
    return ghn.address.getWards(districtId);
  };
