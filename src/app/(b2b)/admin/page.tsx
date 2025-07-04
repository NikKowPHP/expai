import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';

import { OrganizationMembersTable } from './_components/OrganizationMembersTable';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Organization Admin Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Total Members</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Active Users</h3>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium">Avg. Savings</h3>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationMembersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
