import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, Zap, Home, Wifi } from "lucide-react"
import Link from "next/link"

const MOCK_REMINDERS = [
  { id: '1', title: 'Electricity Bill', amount: 1450, dueDate: 'Today', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: '2', title: 'Apartment Rent', amount: 15000, dueDate: 'In 3 days', icon: Home, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: '3', title: 'Internet Subscription', amount: 999, dueDate: 'In 5 days', icon: Wifi, color: 'text-green-500', bg: 'bg-green-500/10' },
]

export function PaymentReminders() {
  return (
    <Card className="shadow-md mt-8">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    Payment Reminders
                </CardTitle>
                <CardDescription>Upcoming bills and scheduled transfers</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_REMINDERS.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${reminder.bg} ${reminder.color}`}>
                  <reminder.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">Due: {reminder.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-sm">₹{reminder.amount}</p>
                <Button size="sm" asChild>
                    <Link href={`/payment?amount=${reminder.amount}&recipient=Biller_${reminder.id}&description=Payment for ${reminder.title}`}>
                        Pay Now
                    </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
