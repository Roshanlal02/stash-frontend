import { ReceiptUpload } from '@/components/receipts/receipt-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const receipts = [
  { id: 1, merchant: 'Luxury Cafe', date: '2024-07-29', category: 'Dining', amount: 250.00, status: 'Anomaly' },
  { id: 2, merchant: 'Tech Gadgets Inc.', date: '2024-07-28', category: 'Electronics', amount: 499.99, status: 'Normal' },
  { id: 3, merchant: 'SuperMart', date: '2024-07-27', category: 'Groceries', amount: 85.40, status: 'Normal' },
  { id: 4, merchant: 'City Transit', date: '2024-07-26', category: 'Transport', amount: 5.50, status: 'Normal' },
];

export default function ReceiptsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Receipts</CardTitle>
            <CardDescription>A list of all your scanned and uploaded receipts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">{receipt.merchant}</TableCell>
                    <TableCell>{receipt.category}</TableCell>
                    <TableCell>{receipt.date}</TableCell>
                    <TableCell>
                      <Badge variant={receipt.status === 'Anomaly' ? 'destructive' : 'secondary'}>
                        {receipt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${receipt.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <ReceiptUpload />
      </div>
    </div>
  );
}
