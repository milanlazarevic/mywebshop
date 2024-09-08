import prisma from "@/app/lib/db";
import { redis } from "@/app/lib/redis";
import { Resend } from "resend";
import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { NextResponse } from "next/server";
// import OrderRecievedEmail from "@/components/emails/OrderRecievedEmail";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;
    console.log("Opuco sam");
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
        console.log(session, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        // destructure metadata that you set in preview page in actions.ts when creating stripe session {userId, orderID}
        const { userId, orderId } = session.metadata || {
          userId: null,
          orderId: null,
        };
        // TODO: when you add orderId in the bag file than add || orderId
        if (!userId) {
          throw new Error("Invalid request metadata!");
        }

        const createdOrder = await prisma.order.create({
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
        });
        console.log(createdOrder);

        await redis.del(`cart-${session.metadata?.userId}`);

        // send email
        // await resend.emails.send({
        //   from: "KnedlaShop <mlazarevic662@gmail.com>",
        //   to: [event.data.object.customer_details.email],
        //   subject: "Thanks for your order!",
        //   react: OrderRecievedEmail({
        //     orderId: createdOrder.id,
        //     orderDate: createdOrder.createdAt.toLocaleDateString(),
        //     // @ts-ignore
        //     shippingAddress: {
        //       name: session.customer_details!.name!,
        //       city: shippingAddress!.city!,
        //       country: shippingAddress!.country!,
        //       postalCode: shippingAddress!.postal_code!,
        //       state: shippingAddress!.state!,
        //       street: shippingAddress!.line1!,
        //     },
        //   }),
        // });
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
