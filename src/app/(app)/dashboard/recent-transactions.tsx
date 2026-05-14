'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('') : '?';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch('/api/user/transactions');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions.</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/history">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6"/></div>
        ) : transactions.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">No recent transactions.</div>
        ) : (
            <div className="space-y-4">
            {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-11 w-11">
                    <AvatarImage src={`https://placehold.co/44x44.png`} />
                    <AvatarFallback>{getInitials(t.recipient || 'Unknown')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-medium">{t.recipient || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{t.status}</p>
                </div>
                <div className="text-right">
                    <p className={cn("font-semibold flex items-center justify-end gap-1", t.amount > 0 ? 'text-destructive' : 'text-success')}>
                    {t.amount > 0 ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16}/>}
                    {`₹${Math.abs(t.amount).toFixed(2)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                </div>
            ))}
            </div>
        )}
      </CardContent>
    </Card>
  )
}
