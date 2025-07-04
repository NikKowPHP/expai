import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { auth } from '@/auth';
import db from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { priceId } = await req.json();

    // Get or create customer in Stripe
    let user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user?.profile?.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email || undefined,
        metadata: {
          userId: session.user.id,
        },
      });

      // Update user profile with Stripe customer ID
      await db.userProfile.update({
        where: { userId: session.user.id },
        data: { stripeCustomerId: customer.id },
      });

      user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true },
      });
    }

    // Create checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      customer: userProfile?.stripeCustomerId ?? ''
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[BILLING_CHECKOUT_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
