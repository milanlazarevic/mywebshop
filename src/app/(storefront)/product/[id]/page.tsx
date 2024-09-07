"use server";
import { FeaturedProducts } from "@/app/components/storefront/FeaturedProducts";
import prisma from "@/app/lib/db";

import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import ProductPage from "./ProductPage";

async function getData(productId: string) {
  const { getUser } = getKindeServerSession();
  const [data, user] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        price: true,
        images: true,
        description: true,
        name: true,
        id: true,
      },
    }),
    getUser(),
  ]);

  if (!data) {
    return notFound();
  }

  return { data, user };
}

export default async function ProductIdRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const { data, user } = await getData(params.id);

  return (
    <>
      <ProductPage user={user} data={data} />
      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </>
  );
}
