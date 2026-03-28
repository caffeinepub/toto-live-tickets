import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetBooking, useSubmitUpiTxnId } from "@/hooks/useQueries";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Copy,
  Loader2,
  Mic2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const UPI_ID = "ankit.mishy79@okhdfcbank";
const UPI_NAME = "Toto%20Live";
const BASE_PRICE = 99;
const BOOKING_FEE_PCT = 0.1;

function calcTotal(ticketCount: number) {
  const fee =
    Math.round(BASE_PRICE * ticketCount * BOOKING_FEE_PCT * 100) / 100;
  return (BASE_PRICE * ticketCount + fee).toFixed(2);
}

function getUpiLink(amount: string) {
  return `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${amount}&cu=INR&tn=Toto%20Live%20Ticket`;
}

function getQRUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data)}&bgcolor=0D0D17&color=DDBA00&margin=12`;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams({ from: "/pay/$bookingId" });
  const [txnId, setTxnId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: booking, isLoading: bookingLoading } = useGetBooking(bookingId);
  const submitUpiTxnId = useSubmitUpiTxnId();

  const ticketCount = booking ? Number(booking.ticketCount) : 1;
  const amount = booking ? calcTotal(ticketCount) : "108.90";
  const upiLink = getUpiLink(amount);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim()) {
      toast.error("Please enter your UPI Transaction ID");
      return;
    }
    try {
      await submitUpiTxnId.mutateAsync({ bookingId, upiTxnId: txnId });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit UPI txn error:", err);
      toast.error("Failed to submit payment. Please try again.");
    }
  };

  const submitting = submitUpiTxnId.isPending;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background spotlight-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display font-black text-3xl text-foreground mb-3">
            Payment <span className="text-primary">Submitted!</span>
          </h2>
          <p className="text-muted-foreground mb-2">
            Your UPI transaction has been recorded.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Admin will verify your payment shortly. Your ticket status will
            update once confirmed.
          </p>
          <Badge className="mb-6 bg-secondary/15 text-secondary border-secondary/30">
            Pending Admin Confirmation
          </Badge>
          <div className="mt-6">
            <Button
              onClick={() => navigate({ to: `/ticket/${bookingId}` })}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold"
              data-ocid="payment.primary_button"
            >
              View My Ticket
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background spotlight-bg">
      <header className="border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
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
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">
              Complete <span className="text-primary">Payment</span>
            </h1>
            <p className="text-muted-foreground">
              Scan the QR code or use UPI ID to pay
            </p>
          </div>

          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-display text-lg text-foreground text-center">
                UPI Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {/* UPI QR */}
                <div className="p-3 bg-background rounded-xl border border-primary/20">
                  {bookingLoading ? (
                    <div
                      className="w-[220px] h-[220px] flex items-center justify-center"
                      data-ocid="payment.loading_state"
                    >
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <img
                      src={getQRUrl(upiLink)}
                      alt="UPI Payment QR Code"
                      width={220}
                      height={220}
                      className="rounded-lg"
                    />
                  )}
                </div>

                <div className="w-full space-y-4">
                  <div className="bg-background/50 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">
                      Amount to Pay
                    </p>
                    <p className="font-display font-black text-3xl text-primary">
                      ₹{amount}
                    </p>
                    {booking && Number(booking.ticketCount) > 1 && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {Number(booking.ticketCount)} tickets × ₹{BASE_PRICE} +
                        10% booking fee
                      </p>
                    )}
                    {(!booking || Number(booking.ticketCount) === 1) && (
                      <p className="text-muted-foreground text-xs mt-1">
                        ₹99 base + ₹9.90 booking fee
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider text-center">
                      UPI ID
                    </p>
                    <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                      <code className="flex-1 text-primary font-mono text-sm text-center">
                        {UPI_ID}
                      </code>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        data-ocid="payment.secondary_button"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-border w-full" />

                <div className="w-full bg-muted/30 rounded-lg p-4">
                  <div className="flex gap-2 items-start">
                    <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>1. Open any UPI app (GPay, PhonePe, Paytm, etc.)</p>
                      <p>2. Scan QR code or enter UPI ID manually</p>
                      <p>
                        3. Pay exactly{" "}
                        <strong className="text-foreground">₹{amount}</strong>
                      </p>
                      <p>4. Enter the Transaction ID below to confirm</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Reference */}
          <div className="mb-4 text-center">
            <p className="text-muted-foreground text-xs">
              Booking ID:{" "}
              <code className="text-primary font-mono">{bookingId}</code>
            </p>
          </div>

          {/* TXN ID Form */}
          <form onSubmit={handleSubmit}>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-base text-foreground">
                  Confirm Your Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="txnId" className="text-foreground/80 text-sm">
                    UPI Transaction ID
                  </Label>
                  <Input
                    id="txnId"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter UTR / Transaction reference number"
                    className="bg-background border-border focus-visible:ring-primary font-mono"
                    data-ocid="payment.input"
                  />
                  <p className="text-muted-foreground text-xs">
                    Found in your UPI app's payment history
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold py-5"
                  disabled={submitting}
                  data-ocid="payment.submit_button"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />{" "}
                      Confirming...
                    </>
                  ) : (
                    "I Have Paid — Confirm"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
