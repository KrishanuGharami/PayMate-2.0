'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ArrowUpCircle, ArrowDownCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?';

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
            {transactions.slice(0, 5).map((t) => {
                const isDebit = t.amount > 0;
                return (
                  <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-11 w-11">
                        <AvatarFallback className={cn(isDebit ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400")}>
                          {getInitials(t.recipient || 'Unknown')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium">{t.recipient || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{t.type || t.status}</p>
                    </div>
                    <div className="text-right">
                        <p className={cn("font-semibold flex items-center justify-end gap-1", isDebit ? 'text-destructive' : 'text-success')}>
                          {isDebit ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16}/>}
                          {isDebit ? `-₹${t.amount.toFixed(2)}` : `+₹${Math.abs(t.amount).toFixed(2)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
            })}
            </div>
        )}
      </CardContent>
    </Card>
  )
}

