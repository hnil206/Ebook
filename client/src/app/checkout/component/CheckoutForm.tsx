'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { calculateShippingFeeAction, checkoutWithCOD, checkoutWithVNPay } from "../actions";
import { useAddressData } from "@/hooks/shop/use-address-data";
import { CartItemType, ProductType, useCartStore } from "@/hooks/shop/use-cart-store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputFieldCustom } from "./InputFieldCustom";
import SelectFieldCustom from "./SelectFieldCustom";
import Image from 'next/image';
import { vietnamCurrency } from '@/utils';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { calculateTotal } from '@/utils';
import { useShippingFee } from '@/hooks/shop/use-shipping-fee';
import { debounce } from 'lodash';

const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống"),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^\d{10}$/, "Số điện thoại không hợp lệ"),
  address: z.string().trim().min(1, "Địa chỉ không hợp lệ"),
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  paymentMethod: z.enum(["cod", "vnpay"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  province: z.string().trim().min(1, "Vui lòng chọn tỉnh/thành phố"),
  ward: z.string().trim().min(1, "Vui lòng chọn phường/xã"),
  district: z.string().trim().min(1, "Vui lòng chọn quận/huyện"),
});

export const CheckoutForm = ({
  user
}: {
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
    role: string[];
    accessToken: string;
  } | undefined;
}) => {
  const { districts, wards, provinces, fetchDistricts, fetchWards } = useAddressData();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [wardCode, setWardCode] = useState("");
  const { cart, clearCart, setCheckoutPayload } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();


  const getItemList = useCallback((cart: ProductType[]): CartItemType[] => {
    return cart.map((item: ProductType) => ({
      productId: item._id,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));
  }, []);

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.name || "",
      phone: "",
      email: user?.email || "",
      paymentMethod: "cod",
      address: "",
      province: "",
      district: "",
      ward: "",
    },
  });

  const { execute, error, isPending } = useServerAction(
    paymentMethod === "cod" ? checkoutWithCOD : checkoutWithVNPay,
    {
      onSuccess: () => {
        // clearCart();
      },
      onError: ({ err }) => {
        toast({
          variant: "error",
          title: 'Đặt hàng thất bại',
          description: `Có lỗi xảy ra, vui lòng thử lại sau, ${err.message || ''}`,
        });
      }
    }
  );

  const calculateTotalWeight = useMemo(() => {
    const cartItemsWeight = cart.reduce((total, item) => total + item.quantity, 0) * 200; // 200g
    return cartItemsWeight;
  }, [cart]);

  // const { shippingFee, isLoading: isLoadingShippingFee } = useShippingFee(districtId, wardCode, provinceId , calculateTotalWeight);

  const shippingFee = 0; //moi sach co kl khac nhau. tu ma xu li

  const handleProvinceChange = useCallback(async (provinceId: number) => {
    await fetchDistricts(provinceId);
    form.setValue("district", "");
    form.setValue("ward", "");
    setProvinceId(provinceId);
    setDistrictId(0);
    setWardCode("");
  }, [fetchDistricts, form]);

  const handleDistrictChange = useCallback(async (districtId: number) => {
    await fetchWards(districtId);
    form.setValue("ward", "");
    setDistrictId(districtId);
    setWardCode("");
  }, [fetchWards, form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleWardChange = useCallback(debounce(async (wardCode: string) => {
    setWardCode(wardCode);
  }, 300), []);

  const onSubmit = async (data: z.infer<typeof checkoutFormSchema>) => {
    const result = await execute({
      ...data,
      orderItems: getItemList(cart),
      fee: shippingFee || 0,
      districtId: districtId,
      wardCode: wardCode,
      provinceId: provinceId,
    });

    if (result[0] && result[0].success) {
      setCheckoutPayload({
        ...data,
        orderItems: getItemList(cart),
        fee: shippingFee || 0,
        provinceId: provinceId,
        districtId: districtId,
        wardCode: wardCode,
      });
      router.push(result[0].redirectUrl as string);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h2 className="text-3xl font-bold mb-8">Checkout</h2> */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data as z.infer<typeof checkoutFormSchema>))} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <InputFieldCustom
                    name="name"
                    label="Họ và tên"
                    placeholder="Nhập họ và tên"
                    form={form}
                  />
                  <InputFieldCustom
                    name="phone"
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    form={form}
                  />
                  <InputFieldCustom
                    name="email"
                    label="Email"
                    placeholder="Nhập email"
                    form={form}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-4 gap-1">
                  <SelectFieldCustom
                    name="province"
                    label="Tỉnh/Thành phố"
                    options={provinces.map((p) => ({
                      id: p.ProvinceID.toString(),
                      name: p.ProvinceName,
                    }))}
                    form={form}
                    onChange={(value) => handleProvinceChange(Number(value))}
                  />
                  <SelectFieldCustom
                    name="district"
                    label="Quận/Huyện"
                    options={districts.map((d) => ({
                      id: d.DistrictID.toString(),
                      name: d.DistrictName,
                    }))}
                    form={form}
                    onChange={(value) => handleDistrictChange(Number(value))}
                  />
                  <SelectFieldCustom
                    name="ward"
                    label="Phường/Xã"
                    options={wards.map((w) => ({
                      id: w.WardCode,
                      name: w.WardName,
                    }))}
                    form={form}
                    onChange={handleWardChange}
                  />
                  <InputFieldCustom
                    name="address"
                    label="Địa chỉ"
                    placeholder="Nhập địa chỉ"
                    form={form}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              setPaymentMethod(value);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal">Thanh toán khi nhận hàng</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="vnpay" />
                              </FormControl>
                              <FormLabel className="font-normal">Thanh toán qua VNPay</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isPending}>
              {/* <Button type="submit" className="w-full" disabled={isPending || isLoadingShippingFee}> */}
                {isPending ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item: ProductType) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <Image
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-sm font-medium">{vietnamCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}              
                <div className="border-t pt-4">
                  {/* {shippingFee > 0 && (
                    <div className="flex text-sm justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{isLoadingShippingFee ? 'Đang tính...' : vietnamCurrency(shippingFee)}</span>
                    </div>
                  )} */}
                  <p className="flex justify-between"><span>Tổng cộng:</span> <span className="font-bold">{vietnamCurrency(calculateTotal(getItemList(cart)) + (shippingFee || 0))}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;