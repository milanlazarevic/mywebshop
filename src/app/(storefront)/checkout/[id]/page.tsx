"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButtons";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { shippingAddressSchema } from "@/app/lib/zodSchemas";
import { createShippingAddress } from "@/app/actions";
import { usePathname } from "next/navigation";

export default function CheckoutForm() {
  const pathname = usePathname();
  const lastPart = pathname.split("/").filter(Boolean).pop();
  const [lastResult, action] = useFormState(
    createShippingAddress.bind(null, lastPart),
    undefined
  );
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: shippingAddressSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/bag">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Checkout</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
          <CardDescription>
            Please provide your shipping details and select a payment method.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>First name</Label>
              <Input
                type="text"
                name={fields.firstName.name}
                key={fields.firstName.key}
                defaultValue={fields.firstName.initialValue}
                placeholder="e.g Milan"
                className="w-full"
              />
              <p className="text-red-500">{fields.firstName.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Last name</Label>
              <Input
                type="text"
                name={fields.lastName.name}
                key={fields.lastName.key}
                defaultValue={fields.lastName.initialValue}
                placeholder="e.g Lazarevic"
                className="w-full"
              />
              <p className="text-red-500">{fields.lastName.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Address</Label>
              <Input
                type="text"
                name={fields.address.name}
                key={fields.address.key}
                defaultValue={fields.address.initialValue}
                placeholder="Shipping Address"
                className="w-full"
              />
              <p className="text-red-500">{fields.address.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>City</Label>
              <Input
                type="text"
                name={fields.city.name}
                key={fields.city.key}
                defaultValue={fields.city.initialValue}
                placeholder="City"
                className="w-full"
              />
              <p className="text-red-500">{fields.city.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Postal Code</Label>
              <Input
                type="text"
                name={fields.postalCode.name}
                key={fields.postalCode.key}
                defaultValue={fields.postalCode.initialValue}
                placeholder="Postal Code"
                className="w-full"
              />
              <p className="text-red-500">{fields.postalCode.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Country</Label>
              <Select name="country">
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BIH">Bosnia and Herzegovina</SelectItem>
                  <SelectItem value="SRB">Serbia</SelectItem>
                  {/* Add other countries as needed */}
                </SelectContent>
              </Select>
              <p className="text-red-500">{fields.country.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Phone number</Label>
              <Input
                type="text"
                name={fields.phoneNumber.name}
                key={fields.phoneNumber.key}
                defaultValue={fields.phoneNumber.initialValue}
                placeholder="e.g 065/222-363"
                className="w-full"
              />
              <p className="text-red-500">{fields.phoneNumber.errors}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Place order" />
        </CardFooter>
      </Card>
    </form>
  );
}
