import prisma from "@/app/lib/db";
import { redis } from "@/app/lib/redis";
import { Resend } from "resend";
import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import OrderRecievedEmail from "@/components/emails/OrderRecievedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;
    console.log("Opuco sam iz puske");
    if (!signature) {
      return new Response("Invalid signature!", { status: 400 });
    }
    let event;
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );

    switch (event.type) {
      case "checkout.session.completed": {
        if (!event.data.object.customer_details?.email) {
          throw new Error("Missing user email!");
        }
        const session = event.data.object as Stripe.Checkout.Session;

        const billingAdress = session.customer_details!.address;
        const shippingAddress = session.shipping_details!.address;
        // destructure metadata that you set in preview page in actions.ts when creating stripe session {userId, orderID}
        const { userId, orderId } = session.metadata || {
          userId: null,
          orderId: null,
        };
        // TODO: when you add orderId in the bag file than add || orderId
        if (!userId || !orderId) {
          throw new Error("Invalid request metadata!");
        }

        const createdOrder = await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            amount: session.amount_total as number,
            status: session.status as string,
            User: {
              connect: {
                id: userId, // connect the existing user by userId
              },
            },
            shippingAddress: {
              create: {
                name: session.customer_details!.name!,
                city: shippingAddress!.city!,
                country: shippingAddress!.country!,
                postalCode: shippingAddress!.postal_code!,
                state: shippingAddress!.state! ?? "",
                street: shippingAddress!.line1!,
                phoneNumber: session.customer_details?.phone,
              },
            } as any,
            billingAddress: {
              create: {
                name: session.customer_details!.name!,
                city: billingAdress!.city!,
                country: billingAdress!.country!,
                postalCode: billingAdress!.postal_code!,
                state: billingAdress!.state! ?? "",
                street: billingAdress!.line1!,
              },
            } as any,
          },
          include: {
            OrderedProducts: {
              select: {
                quantity: true,
                product: true,
              },
            },
          },
        });

        await redis.del(`cart-${session.metadata?.userId}`);

        // send email
        const { data, error } = await resend.emails.send({
          from: "KnedlaShop <mlazarevic662@resend.dev>",
          to: [event.data.object.customer_details.email],
          subject: "Thanks for your order!",
          react: OrderRecievedEmail({
            orderId: createdOrder.id,
            orderDate: createdOrder.createdAt.toLocaleDateString(),
            // @ts-ignore
            shippingAddress: {
              name: session.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              state: shippingAddress!.state!,
              street: shippingAddress!.line1!,
            },
            orderedProducts: createdOrder.OrderedProducts,
          }),
        });
        console.log(event.data.object.customer_details.email, "gdje si poslo");
        console.log(error, data);
        if (error) {
          return new Response(null, { status: 400 });
        }
        break;
      }
      default: {
        console.log("unhandled event");
      }
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    console.log(error);
    // send this to sentry in future!
    return NextResponse.json(
      { message: "Something went wrong!", ok: false },
      { status: 500 }
    );
  }
}
