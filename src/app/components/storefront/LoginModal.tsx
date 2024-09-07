import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className=" z-[999999]">
        <DialogHeader>
          {/* <div className="relative mx-auto w-24 h-24 mb-2">
            {/* logo 
            <Image
              src="/all.jpeg"
              alt="snake image"
              className="object-contain"
              fill
            />
          </div> */}
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900 my-4">
            Great choice, but first...
            <p className="text-black font-bold text-md lg:text-xl mx-auto">
              <span className="text-primary">Knedla</span>Shop
            </p>
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">
              Before you continue shoping -
            </span>{" "}
            Please login or create an account to add items to the cart.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LoginModal;
