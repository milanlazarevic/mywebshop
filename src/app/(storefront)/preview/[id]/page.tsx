"use server";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import PreviewPage from "./PreviewPage";

async function getData(orderId: string) {
  const data = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      shippingAddress: true,
      OrderedProducts: {
        select: {
          product: true,
          quantity: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function OrderPreview({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const order = await getData(params.id);

  return <PreviewPage order={order} />;
}
