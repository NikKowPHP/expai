import { Transaction } from '@prisma/client';
import prisma from '../prisma';

export type Opportunity = {
  type: 'credit_card_interest' | 'subscription' | 'investment' | 'savings';
  amountSaved: number;
  message: string;
  cta?: {
    text: string;
    url: string;
  };
};

export class OpportunityFinder {
  /**
   * Scans a user's recent transactions for potential optimization opportunities
   */
  static async findOpportunities(userId: string): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Get user's last 90 days of transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Check for high credit card interest payments
    const creditCardInterestOpportunity = this.findCreditCardInterestOpportunity(transactions);
    if (creditCardInterestOpportunity) {
      opportunities.push(creditCardInterestOpportunity);
    }

    // Check for unused subscriptions
    const subscriptionOpportunities = await this.findSubscriptionOpportunities(userId, transactions);
    opportunities.push(...subscriptionOpportunities);

    return opportunities;
  }

  private static findCreditCardInterestOpportunity(transactions: Transaction[]): Opportunity | null {
    const interestPayments = transactions.filter(t =>
      t.categoryId === 'Interest' && t.amount.toNumber() > 0
    );

    if (interestPayments.length === 0) return null;

    const totalInterest = interestPayments.reduce((sum, t) => sum + t.amount.toNumber(), 0);
    if (totalInterest < 50) return null; // Only show if significant amount

    return {
      type: 'credit_card_interest',
      amountSaved: totalInterest * 0.5, // Estimate 50% savings potential
      message: `You're paying $${totalInterest.toFixed(2)} in credit card interest.`,
      cta: {
        text: 'Find a better card',
        url: '/affiliate/credit-cards',
      },
    };
  }

  private static async findSubscriptionOpportunities(
    userId: string,
    transactions: Transaction[]
  ): Promise<Opportunity[]> {
    const subscriptions = transactions.filter(t =>
      t.categoryId === 'Subscription' ||
      t.description.toLowerCase().includes('subscription')
    );

    if (subscriptions.length === 0) return [];

    // Group by merchant to find unused subscriptions
    const merchantMap = new Map<string, Transaction[]>();
    subscriptions.forEach(t => {
      const key = t.description.split(' ')[0]; // Simple merchant extraction
      if (!merchantMap.has(key)) {
        merchantMap.set(key, []);
      }
      merchantMap.get(key)?.push(t);
    });

    const opportunities: Opportunity[] = [];
    const now = new Date();

    for (const [merchant, merchantTransactions] of merchantMap) {
      // Check if user hasn't used the service in last 30 days
      const lastUsed = await prisma.transaction.findFirst({
        where: {
          userId,
          description: {
            contains: merchant,
          },
          NOT: {
            categoryId: 'Subscription',
          },
          transactionDate: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          transactionDate: 'desc',
        },
      });

      if (!lastUsed) {
        const monthlyCost = merchantTransactions.reduce((sum, t) => sum + t.amount.toNumber(), 0) / merchantTransactions.length;
        opportunities.push({
          type: 'subscription',
          amountSaved: monthlyCost,
          message: `You may not be using your ${merchant} subscription.`,
          cta: {
            text: 'Cancel subscription',
            url: '/affiliate/subscription-manager',
          },
        });
      }
    }

    return opportunities;
  }
}
