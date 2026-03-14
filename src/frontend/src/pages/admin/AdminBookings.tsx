import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllBookings, useUpdatePaymentStatus } from "@/hooks/useQueries";
import { CheckCircle, Loader2, RefreshCw, Search, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Booking, PaymentStatus } from "../../backend.d";

function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === PaymentStatus.confirmed)
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
        Confirmed
      </Badge>
    );
  if (status === PaymentStatus.rejected)
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-xs">
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-secondary/15 text-secondary border-secondary/30 text-xs">
      Pending
    </Badge>
  );
}

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const {
    data: bookings,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllBookings();
  const updateStatus = useUpdatePaymentStatus();

  const filtered = (bookings ?? []).filter((b: Booking) => {
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchStatus =
      statusFilter === "all" || b.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleConfirm = async (bookingId: string) => {
    try {
      await updateStatus.mutateAsync({
        bookingId,
        status: PaymentStatus.confirmed,
      });
      toast.success("Payment confirmed!");
    } catch {
      toast.error("Failed to confirm payment");
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateStatus.mutateAsync({
        bookingId,
        status: PaymentStatus.rejected,
      });
      toast.error("Payment rejected.");
    } catch {
      toast.error("Failed to reject payment");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, booking ID..."
            className="pl-10 bg-card border-border"
            data-ocid="bookings.search_input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-full sm:w-44 bg-card border-border"
            data-ocid="bookings.select"
          >
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={PaymentStatus.pending}>Pending</SelectItem>
            <SelectItem value={PaymentStatus.confirmed}>Confirmed</SelectItem>
            <SelectItem value={PaymentStatus.rejected}>Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-border"
          data-ocid="bookings.secondary_button"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2" data-ocid="bookings.loading_state">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: loading skeletons are positional
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-border overflow-hidden"
          data-ocid="bookings.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-card/50 hover:bg-card/50">
                <TableHead className="text-muted-foreground text-xs">
                  #
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Name
                </TableHead>
                <TableHead className="text-muted-foreground text-xs hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="text-muted-foreground text-xs hidden sm:table-cell">
                  Phone
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Tickets
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground text-xs hidden lg:table-cell">
                  Check-In
                </TableHead>
                <TableHead className="text-muted-foreground text-xs">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="bookings.empty_state"
                  >
                    {search || statusFilter !== "all"
                      ? "No bookings match your filter."
                      : "No bookings yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((booking: Booking, idx: number) => (
                  <TableRow
                    key={booking.bookingId}
                    className="border-border hover:bg-card/50"
                    data-ocid={`bookings.row.${idx + 1}` as any}
                  >
                    <TableCell className="text-muted-foreground text-xs font-mono">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground font-medium text-sm">
                          {booking.name}
                        </p>
                        <p className="text-muted-foreground text-xs font-mono hidden sm:block">
                          {booking.bookingId.slice(0, 12)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                      {booking.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                      {booking.phone}
                    </TableCell>
                    <TableCell className="text-foreground font-bold text-sm">
                      {booking.ticketCount.toString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.paymentStatus} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        className={
                          booking.checkedIn
                            ? "bg-green-500/15 text-green-400 border-green-500/30 text-xs"
                            : "bg-muted/40 text-muted-foreground border-border text-xs"
                        }
                      >
                        {booking.checkedIn ? "✓ In" : "Out"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {booking.paymentStatus !== PaymentStatus.confirmed && (
                          <Button
                            size="sm"
                            onClick={() => handleConfirm(booking.bookingId)}
                            className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border-0 h-7 px-2 text-xs"
                            disabled={updateStatus.isPending}
                            data-ocid="bookings.confirm_button"
                          >
                            {updateStatus.isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                        {booking.paymentStatus !== PaymentStatus.rejected && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(booking.bookingId)}
                            className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-0 h-7 px-2 text-xs"
                            disabled={updateStatus.isPending}
                            data-ocid="bookings.delete_button"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      )}

      <p className="text-muted-foreground text-xs">
        Showing {filtered.length} of {bookings?.length ?? 0} bookings
      </p>
    </div>
  );
}
