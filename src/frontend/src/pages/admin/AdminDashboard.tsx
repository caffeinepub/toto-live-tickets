import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBookings } from "@/hooks/useQueries";
import {
  CheckCircle,
  Clock,
  Ticket,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { PaymentStatus } from "../../backend.d";

export default function AdminDashboard() {
  const { data: bookings, isLoading } = useGetAllBookings();

  const stats = useMemo(() => {
    if (!bookings) return null;
    const total = bookings.length;
    const confirmed = bookings.filter(
      (b) => b.paymentStatus === PaymentStatus.confirmed,
    ).length;
    const pending = bookings.filter(
      (b) => b.paymentStatus === PaymentStatus.pending,
    ).length;
    const rejected = bookings.filter(
      (b) => b.paymentStatus === PaymentStatus.rejected,
    ).length;
    const checkedIn = bookings.filter((b) => b.checkedIn).length;
    const totalTickets = bookings.reduce(
      (sum, b) => sum + Number(b.ticketCount),
      0,
    );
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === PaymentStatus.confirmed)
      .reduce((sum, b) => sum + Number(b.ticketCount) * 108.9, 0);
    return {
      total,
      confirmed,
      pending,
      rejected,
      checkedIn,
      totalTickets,
      totalRevenue,
    };
  }, [bookings]);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats?.total ?? 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Confirmed",
      value: stats?.confirmed ?? 0,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Pending",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      label: "Checked In",
      value: stats?.checkedIn ?? 0,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Tickets",
      value: stats?.totalTickets ?? 0,
      icon: Ticket,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="dashboard.loading_state">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: loading skeletons are positional
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground mb-1">
          Overview
        </h2>
        <p className="text-muted-foreground text-sm">
          Live stats for Toto Live: The First Chapter
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </CardTitle>
                <div
                  className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}
                >
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={`font-display font-black text-3xl ${card.color}`}>
                  {card.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {stats && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg text-foreground">
              Revenue (Confirmed)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display font-black text-4xl text-primary">
              ₹{stats.totalRevenue.toFixed(2)}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              From {stats.confirmed} confirmed booking
              {stats.confirmed !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      )}

      {bookings && bookings.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent
            className="py-16 text-center"
            data-ocid="dashboard.empty_state"
          >
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground mb-1">
              No bookings yet
            </p>
            <p className="text-muted-foreground text-sm">
              Bookings will appear here once users start registering.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
