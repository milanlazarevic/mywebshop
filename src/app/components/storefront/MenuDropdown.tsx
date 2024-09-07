"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingBagIcon } from "lucide-react";
import { navbarLinks } from "./NavbarLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserDropdown } from "./UserDropdown";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

interface iUserData {
  email: string | null;
  given_name: string | null;
  picture: string | null;
  total: number | null;
}

export default function MenuDropdown({
  email,
  given_name,
  picture,
  total,
}: iUserData) {
  const [open, setOpen] = useState(false);
  const location = usePathname();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex flex-row justify-between align-bottom mt-10">
            What we offer
            {email && picture && given_name ? (
              <div className=" mt-[-10px]">
                <UserDropdown
                  email={email as string}
                  name={given_name as string}
                  userImage={
                    picture ?? `https://avatar.vercel.sh/${given_name}`
                  }
                />
              </div>
            ) : null}
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-col mt-6">
          {navbarLinks.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className={cn(
                location === item.href
                  ? "bg-muted"
                  : "hover:bg-muted hover:bg-opacity-75",
                "group p-2 font-medium rounded-md"
              )}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {total !== null && email ? (
            <Button
              variant={"default"}
              onClick={() => setOpen(false)}
              className="mt-4"
              asChild
            >
              <Link
                href="/bag"
                className="group p-2 flex items-center mr-2 font-medium "
              >
                <span className="mr-1 text-sm font-medium ">{total}</span>
                <ShoppingBagIcon className=" mr-2 h-6 w-6 " />
                My cart
              </Link>
            </Button>
          ) : (
            <div className="flex items-start flex-row m-0 gap-4 mt-6">
              <Button variant="outline" asChild>
                <LoginLink>Sign in</LoginLink>
              </Button>
              <span className="h-10 w-px bg-gray-200"></span>
              <Button variant="default" asChild>
                <RegisterLink>Create Account</RegisterLink>
              </Button>
            </div>
          )}
        </div>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
