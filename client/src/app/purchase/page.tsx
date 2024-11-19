'use client'
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a Spinner component

interface Order {
  _id: string;
  orderNumber?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  total: number;
  shipAddress: string;
  shippingStatus: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    const token = user?.accessToken;
    if (!token) {
      setError("User not authenticated");
      return;
    }
    try {
      const response = await axios.get("orders/your-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) return <div className="flex justify-center"><Spinner /></div>;
  if (error) return <div className="text-red-500 text-center font-semibold">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="border p-4 rounded-md shadow-md bg-white transition-transform transform hover:scale-105"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <p
                      className={cn("px-2 py-1 rounded-full text-sm font-medium transition-transform transform hover:scale-105", {
                        "bg-green-100 text-green-600": order.shippingStatus === "Delivered",
                        "bg-yellow-100 text-yellow-600": order.shippingStatus === "Pending",
                        "bg-red-100 text-red-600": order.shippingStatus === "Cancelled",
                      })}
                    >
                      {order.shippingStatus}
                    </p>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <p>Name: {order.name}</p>
                    <p>Email: {order.email}</p>
                    <p>Phone: {order.phone}</p>
                    <p>Total: {order.total} VND</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    {order.shippingStatus === "Pending" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="hover:bg-gray-200"
                        onClick={() => {
                          // Handle order cancel button click
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;