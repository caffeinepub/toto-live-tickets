import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBooking } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Clock3,
  Download,
  Hash,
  Mail,
  MapPin,
  Mic2,
  Phone,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { PaymentStatus } from "../backend.d";

function getQRUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}&bgcolor=0D0D17&color=DDBA00&margin=8`;
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  if (status === PaymentStatus.confirmed) {
    return (
      <Badge className="bg-green-500/15 text-green-400 border-green-500/30 gap-1">
        <CheckCircle className="w-3 h-3" /> Confirmed
      </Badge>
    );
  }
  if (status === PaymentStatus.rejected) {
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 gap-1">
        <AlertCircle className="w-3 h-3" /> Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-secondary/15 text-secondary border-secondary/30 gap-1">
      <Clock3 className="w-3 h-3" /> Pending
    </Badge>
  );
}

export default function TicketPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: "/ticket/$bookingId" });

  const { data: booking, isLoading, isError } = useGetBooking(bookingId);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center px-4"
        data-ocid="ticket.loading_state"
      >
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-12 w-2/3 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center" data-ocid="ticket.error_state">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Ticket Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find this booking. Please check your booking ID.
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            data-ocid="ticket.primary_button"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background spotlight-bg">
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80 print:hidden">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="nav.link"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Mic2 className="text-primary w-5 h-5" />
              <span className="font-display font-bold text-sm tracking-wide uppercase">
                Toto Live
              </span>
            </div>
          </div>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 print:hidden"
            data-ocid="ticket.primary_button"
          >
            <Download className="mr-2 w-4 h-4" />
            Save as PDF
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center print:hidden">
            <h1 className="font-display font-black text-3xl text-foreground mb-2">
              Your <span className="text-primary">Ticket</span>
            </h1>
            <div className="flex justify-center">
              <StatusBadge status={booking.paymentStatus} />
            </div>
            {booking.paymentStatus === PaymentStatus.pending && (
              <p className="text-muted-foreground text-sm mt-3">
                Payment pending admin confirmation. This page auto-refreshes
                every 10 seconds.
              </p>
            )}
          </div>

          {/* Ticket Card */}
          <div
            data-print-ticket
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-glow"
          >
            {/* Ticket Header */}
            <div
              className="px-8 py-6 text-center relative"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.015 265) 0%, oklch(0.18 0.04 90) 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.85 0.20 95 / 0.12) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <p className="text-primary/70 text-xs font-semibold tracking-widest uppercase mb-1">
                  Stand-Up Comedy
                </p>
                <h2 className="font-display font-black text-3xl text-primary mb-1">
                  TOTO LIVE
                </h2>
                <p className="font-display text-lg text-foreground/80">
                  The First Chapter
                </p>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="px-8 py-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3" /> Name
                </p>
                <p className="text-foreground font-semibold">{booking.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Tickets
                </p>
                <p className="text-foreground font-semibold">
                  {booking.ticketCount.toString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </p>
                <p className="text-foreground font-semibold text-sm truncate">
                  {booking.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="text-foreground font-semibold">{booking.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </p>
                <p className="text-foreground font-semibold">TBA</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Venue
                </p>
                <p className="text-foreground font-semibold">TBA</p>
              </div>
              <div className="col-span-2 space-y-1">
                <p className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time
                </p>
                <p className="text-foreground font-semibold">TBA</p>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="mx-8 border-t border-dashed border-border/60" />

            {/* QR Section */}
            <div className="px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="p-2 bg-background/50 rounded-xl border border-border">
                  <img
                    src={getQRUrl(booking.bookingId)}
                    alt="Ticket QR Code"
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">
                    Booking ID
                  </p>
                  <code className="text-primary font-mono text-sm font-bold break-all">
                    {booking.bookingId}
                  </code>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">
                    Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={booking.paymentStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider">
                    Check-In
                  </p>
                  <p className="text-foreground text-sm font-semibold">
                    {booking.checkedIn ? "✅ Checked In" : "Not yet checked in"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-primary/5 border-t border-primary/10 px-8 py-3 text-center">
              <p className="text-muted-foreground text-xs">
                Present this QR code at the venue for entry
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
            <Button
              onClick={handlePrint}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold"
              data-ocid="ticket.primary_button"
            >
              <Download className="mr-2 w-4 h-4" />
              Download / Print Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/" })}
              className="border-border text-foreground/80 hover:bg-accent"
              data-ocid="ticket.secondary_button"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
