"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible"; // Import collapsible from shadcn

import { Category, ProductStatus } from "@prisma/client";
import Image from "next/image";

interface iOrder {
  id: string;
  amount: number;
  createdAt: Date;
  status: string;
  User: {
    firstName: string;
    email: string;
    profileImage?: string | null;
  } | null;
  shippingAddress: {
    country: string;
    city: string;
    postalCode: string;
    street: string;
    phoneNumber: string | null;
  } | null;
  OrderedProducts: {
    quantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      status: ProductStatus;
      price: number;
      images: string[];
      category: Category;
      isFeatured: boolean;
      createdAt: Date;
    };
  }[];
}

export default function OrdersTable({ orders }: { orders: iOrder[] }) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store!</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Shipping Details</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((item) => (
              <>
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.User?.firstName}</p>
                    <p className="hidden md:flex text-sm text-muted-foreground">
                      {item.User?.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">
                      {item.shippingAddress?.country},{" "}
                      {item.shippingAddress?.city},{" "}
                      {item.shippingAddress?.postalCode}
                    </p>
                    <p className="hidden md:flex text-sm text-muted-foreground">
                      {item.shippingAddress?.street}
                    </p>
                  </TableCell>
                  <TableCell>{item.shippingAddress?.phoneNumber}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat("en-US").format(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${new Intl.NumberFormat("en-US").format(item.amount / 100)}
                  </TableCell>
                  {/* Chevron for toggling the collapsible content */}
                  <TableCell className="float-right mr-4">
                    <button onClick={() => toggleRow(item.id)}>
                      <ChevronDown
                        className={`transition-transform ${
                          expandedRows.includes(item.id) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
                {/* Collapsible content for expanded rows */}
                {expandedRows.includes(item.id) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      {/* Collapsible details go here */}
                      <Collapsible open={expandedRows.includes(item.id)}>
                        <div className="p-4 bg-gray-50 rounded-md">
                          <h4 className="font-medium">Order Details:</h4>
                          <ul>
                            {item.OrderedProducts.map((productItem, index) => (
                              <li
                                key={index}
                                className="flex flex-row gap-4 my-4"
                              >
                                <Image
                                  className="object-cover max-h-[100px]"
                                  src={productItem.product.images[0]}
                                  alt="product image"
                                  width={100}
                                  height={100}
                                />
                                {productItem.product.name} - Quantity:{" "}
                                {productItem.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Collapsible>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </table>
      </CardContent>
    </Card>
  );
}
