'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Order {
    _id: string;
    orderNumber?: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    total: number;
    shipAddress: string;
    trackingNumber: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingStatus: string;
    createdAt: Date;
    shipDate: Date;
}

// Format number to VND currency
const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (error) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/orders/shipping-status/${orderId}`, { status });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === response.data._id ? response.data : order
                )
            );
        } catch (error) {
            setError('Failed to update status');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-4 h-4" /> },
            'SHIPPED': { color: 'bg-blue-100 text-blue-800', icon: <Truck className="w-4 h-4" /> },
            'DELIVERED': { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-4 h-4" /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['PENDING'];
        
        return (
            <Badge className={`flex items-center gap-1 ${config.color}`}>
                {config.icon}
                {status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="mx-auto mt-8 max-w-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-2 text-red-500">
                        <AlertCircle className="w-6 h-6" />
                        <p className="text-lg font-medium">{error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <Package className="w-6 h-6" />
                            Orders Management
                        </CardTitle>
                        <Badge className="text-sm">
                            Total Orders: {orders.length}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order)}>
                                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{order.name}</p>
                                                <p className="text-sm text-muted-foreground">{order.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatVND(order.total)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(order.shippingStatus)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order._id, 'SHIPPED');
                                                    }}
                                                >
                                                    <Truck className="w-4 h-4 mr-1" />
                                                    Ship
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateStatus(order._id, 'DELIVERED');
                                                    }}
                                                >
                                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                                    Deliver
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Order Info</h4>
                                    <div className="mt-1">
                                        <p className="font-medium">#{selectedOrder.orderNumber}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Customer</h4>
                                    <div className="mt-1">
                                        <p className="font-medium">{selectedOrder.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium text-sm text-muted-foreground">Shipping Address</h4>
                                <p className="mt-1">{selectedOrder.shipAddress}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Payment Details</h4>
                                    <div className="mt-1">
                                        <p>Method: {selectedOrder.paymentMethod}</p>
                                        <p>Status: {selectedOrder.paymentStatus}</p>
                                        <p className="font-medium">Total: {formatVND(selectedOrder.total)}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground">Shipping Details</h4>
                                    <div className="mt-1">
                                        <p>Status: {selectedOrder.shippingStatus}</p>
                                        <p>Tracking: {selectedOrder.trackingNumber || 'Not available'}</p>
                                        <p>Ship Date: {selectedOrder.shipDate ? new Date(selectedOrder.shipDate).toLocaleDateString() : 'Not shipped'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrdersPage;