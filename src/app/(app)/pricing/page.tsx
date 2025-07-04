'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpgrade = async (priceId: string) => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '2 statement uploads per month',
        'Basic financial insights',
        'Transaction categorization',
        'Basic budgeting tools',
      ],
      priceId: '',
      cta: 'Current Plan',
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited statement uploads',
        'Advanced financial insights',
        'AI-powered recommendations',
        'Compound interest simulator',
        'Priority support',
      ],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
      cta: 'Upgrade Now',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <div className="flex items-baseline mt-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="ml-2 text-gray-500">{plan.period}</span>
            </div>
            <ul className="my-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <span className="mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.priceId)}
              disabled={!plan.priceId}
              className={`w-full py-2 px-4 rounded-md ${
                plan.name === 'Premium'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
