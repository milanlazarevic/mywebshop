// import prisma from "@/app/lib/db";
import prisma from "@/app/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import OrdersTable from "./OrdersTable";

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      amount: true,
      createdAt: true,
      status: true,
      id: true,
      User: {
        select: {
          firstName: true,
          email: true,
          profileImage: true,
        },
      },
      shippingAddress: {
        select: {
          country: true,
          city: true,
          postalCode: true,
          street: true,
          phoneNumber: true,
        },
      },
      OrderedProducts: {
        select: {
          product: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function OrdersPage() {
  noStore();
  const data = await getData();
  return <OrdersTable orders={data} />;
}
