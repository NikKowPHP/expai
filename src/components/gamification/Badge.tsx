'use client';

import { Card, Text, Title3 } from '@fluentui/react-components';
import { LockClosedFilled, LockOpenFilled } from '@fluentui/react-icons';

interface BadgeProps {
  name: string;
  description: string;
  isUnlocked: boolean;
}

export default function Badge({ name, description, isUnlocked }: BadgeProps) {
  const cardClassName = `p-4 flex flex-col items-center text-center ${
    isUnlocked ? 'bg-green-50 shadow-md' : 'bg-gray-100 grayscale opacity-70'
  }`;

  return (
    <Card className={cardClassName}>
      {isUnlocked ? (
        <LockOpenFilled className="text-green-600 text-4xl mb-2" />
      ) : (
        <LockClosedFilled className="text-gray-400 text-4xl mb-2" />
      )}
      <Title3 className="mb-1">{name}</Title3>
      <Text className="text-sm text-gray-600">{description}</Text>
    </Card>
  );
}
