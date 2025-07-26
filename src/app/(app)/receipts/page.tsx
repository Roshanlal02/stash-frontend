import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const receipts = [
  { id: 1, merchant: 'Luxury Cafe', date: '2024-07-29', category: 'Dining', amount: 20000.00, status: 'Anomaly' },
  { id: 2, merchant: 'Tech Gadgets Inc.', date: '2024-07-28', category: 'Electronics', amount: 41250.00, status: 'Normal' },
  { id: 3, merchant: 'SuperMart', date: '2024-07-27', category: 'Groceries', amount: 7050.00, status: 'Normal' },
  { id: 4, merchant: 'City Transit', date: '2024-07-26', category: 'Transport', amount: 450.00, status: 'Normal' },
];

export default function ReceiptsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 max-w-7xl mx-auto">
      <div className="w-full">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Your Receipts</CardTitle>
            <CardDescription>A list of all your scanned and uploaded receipts.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] px-4">Merchant</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[100px]">Category</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[100px]">Date</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[80px]">Status</TableHead>
                    <TableHead className="text-right min-w-[100px] px-4">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium px-4">
                        <div className="min-w-0">
                          <div className="truncate">{receipt.merchant}</div>
                          <div className="text-xs text-muted-foreground sm:hidden space-y-0.5">
                            <div>{receipt.category} • {receipt.date}</div>
                            {receipt.status === 'Anomaly' && (
                              <div className="text-destructive font-medium">Anomaly Detected</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm">{receipt.category}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm">{receipt.date}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={receipt.status === 'Anomaly' ? 'destructive' : 'secondary'} className="text-xs">
                          {receipt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <span className="font-medium">₹{receipt.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
