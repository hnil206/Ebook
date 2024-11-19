import useSWR from 'swr';
import { useServerAction } from 'zsa-react';
import { calculateShippingFeeAction } from '@/app/checkout/actions';

export function useShippingFee(districtId: number, wardCode: string, provinceId: number, weight: number) {
    const {execute: calculateShippingFee} = useServerAction(calculateShippingFeeAction);

    const { data: shippingFee, error } = useSWR(
        provinceId && districtId && wardCode ? [`shippingFee`, districtId, wardCode, weight, provinceId] : null,
        async () => {
          const data = await calculateShippingFee({
            districtId: Number(districtId),
            wardCode: wardCode,
            weight: weight,
            length: 10,
            width: 10,
            height: 10,
            provinceId: Number(provinceId),
          });
          return data[0];
        },
        { revalidateOnFocus: false, revalidateOnReconnect: false }
      );
    
      return {
        shippingFee,
        isLoading: !error && !shippingFee,
        isError: error,
      };
}
