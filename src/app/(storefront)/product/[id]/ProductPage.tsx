"use client";

import { addItem } from "@/app/actions";
import { ImageSlider } from "@/app/components/storefront/ImageSlider";
import LoginModal from "@/app/components/storefront/LoginModal";
import { ShoppingBagButton } from "@/app/components/SubmitButtons";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { StarIcon } from "lucide-react";
import { useState } from "react";

interface iProduct {
  name: string;
  id: string;
  description: string;
  price: number;
  images: string[];
}

const ProductPage = ({
  user,
  data,
}: {
  user: KindeUser | null;
  data: iProduct;
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const addProducttoShoppingCart = () => {
    console.log(user);
    if (!user) {
      // need to log in
      localStorage.setItem("product-id", data.id);
      setIsLoginModalOpen(true);
    } else {
      addItem(data.id);
      // addItem.bind(null, data.id);
    }
  };
  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
        <ImageSlider images={data.images} />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {data.name}
          </h1>
          <p className="text-3xl mt-2 text-gray-900">${data.price}</p>
          <div className="mt-3 flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-base text-gray-700 mt-6">{data.description}</p>

          <form action={addProducttoShoppingCart}>
            <ShoppingBagButton />
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
