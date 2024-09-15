"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { placeOrder } from "@/app/actions";
import { Product } from "@prisma/client";
import { SubmitButton } from "@/app/components/SubmitButtons";

export interface iOrder {
  id: string;
  status: string;
  amount: number;
  createdAt: Date;
  userId: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
    phoneNumber: string | null;
  } | null;
  OrderedProducts: {
    product: Product;
    quantity: number;
  }[];
}

export default function PreviewPage({ order }: { order: iOrder }) {
  return (
    <div className="container mx-auto p-6">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Order Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between ">
            <div>
              <div className="mb-4">
                <Label>Order ID:</Label>
                <p>{order.id}</p>
              </div>
              <div className="mb-4">
                <Label>Status:</Label>
                <p>{order.status}</p>
              </div>
              <div className="mb-4">
                <Label>Amount:</Label>
                <p>${(order.amount / 100).toFixed(2)}</p>
                <Label>Shipping:</Label>
                <p>$ 8.00</p>
                <Label>Total:</Label>
                <p className="text-xl md:text-3xl mt-2">
                  ${(order.amount / 100 + 8).toFixed(2)}
                </p>
              </div>
              <div className="mb-4">
                <Label>Date:</Label>
                <p>{order.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p>Phone: {order.shippingAddress?.phoneNumber}</p>
              </div>
            </div>
            <div className="mr-6">
              <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>
              {order.OrderedProducts.map((orderedProduct, index) => (
                <div key={index} className="flex items-center gap-4 mb-6">
                  <Image
                    src={orderedProduct.product.images[0]}
                    alt={orderedProduct.product.name}
                    width={80}
                    height={80}
                    className="rounded-lg border"
                  />
                  <div>
                    <p className="font-semibold">
                      {orderedProduct.product.name}
                    </p>
                    <p>Price: ${orderedProduct.product.price.toFixed(2)}</p>
                    <p>Quantity: {orderedProduct.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="">
          <form action={() => placeOrder(order)}>
            <SubmitButton text="Place order" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
