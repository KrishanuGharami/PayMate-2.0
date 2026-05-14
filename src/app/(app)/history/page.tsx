'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const getBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED': return 'success';
        case 'PENDING': return 'warning';
        case 'FAILED': return 'destructive';
        default: return 'secondary';
    }
}

export default function HistoryPage() {
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
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
                    <p className="text-muted-foreground">View and manage all your past transactions.</p>
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Statement</Button>
            </header>
            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-grow md:flex-grow-0">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                           <Input placeholder="Search transactions..." className="pl-10 max-w-xs"/>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Transaction Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                    <SelectItem value="bills">Bills</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">You have no transaction history.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <p className="font-medium">{t.recipient || 'Unknown'}</p>
                                            <p className="text-sm text-muted-foreground">{t.type || 'Transfer'}</p>
                                        </TableCell>
                                        <TableCell>{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                                        <TableCell className={`text-right font-semibold ${t.amount > 0 ? 'text-destructive' : 'text-success'}`}>
                                            {t.amount > 0 ? `-₹${t.amount.toFixed(2)}` : `+₹${Math.abs(t.amount).toFixed(2)}`}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={getBadgeVariant(t.status)}>{t.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
