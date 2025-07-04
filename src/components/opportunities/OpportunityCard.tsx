import { Opportunity } from '../../lib/services/opportunityService';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onRevealOffer?: () => void;
}

export function OpportunityCard({ opportunity, onRevealOffer }: OpportunityCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Opportunity Found!</CardTitle>
        <CardDescription>You could save ${opportunity.amountSaved.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{opportunity.message}</p>
      </CardContent>
      <CardFooter className="flex justify-end">
        {opportunity.cta && (
          <Button variant="outline" onClick={onRevealOffer}>
            {opportunity.cta.text}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface OpportunitiesListProps {
  opportunities: Opportunity[];
}

export function OpportunitiesList({ opportunities }: OpportunitiesListProps) {
  const handleRevealOffer = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {opportunities.map((opp) => (
        <OpportunityCard
          key={`${opp.type}-${opp.amountSaved}`}
          opportunity={opp}
          onRevealOffer={() => opp.cta && handleRevealOffer(opp.cta.url)}
        />
      ))}
    </div>
  );
}
