"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAuthStatus } from "./action";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const Page = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const productId = localStorage.getItem("product-id");
    if (productId) setProductId(productId);
  }, []);

  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await getAuthStatus(),
    retry: true,
    retryDelay: 500,
  });

  useEffect(() => {
    if (data?.success) {
      if (productId) {
        localStorage.removeItem("product-id");
        router.push(`/product/${productId}`);
      } else {
        router.push("/");
      }
    }
  }, [data, productId, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
