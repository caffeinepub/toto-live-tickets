import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateBooking } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Mic2, Minus, Plus, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const BASE_PRICE = 99;
const BOOKING_FEE_PCT = 0.1;

export default function BookingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createBooking = useCreateBooking();

  const bookingFee = Math.round(BASE_PRICE * qty * BOOKING_FEE_PCT * 100) / 100;
  const total = BASE_PRICE * qty + bookingFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
      e.email = "Valid email required";
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Valid 10-digit phone required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (!createBooking.isActorReady) {
      toast.error("Still connecting, please try again in a moment.");
      return;
    }

    try {
      const bookingId = await createBooking.mutateAsync({
        name,
        email,
        phone,
        ticketCount: qty,
      });
      toast.success("Booking created! Proceed to payment.");
      navigate({ to: `/pay/${bookingId}` });
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const isSubmitting = createBooking.isPending;
  const isDisabled = isSubmitting || !createBooking.isActorReady;

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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">
              Book Your <span className="text-primary">Ticket</span>
            </h1>
            <p className="text-muted-foreground">
              Fill in your details to secure your spot at Toto Live: The First
              Chapter
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_340px] gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-foreground">
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-foreground/80 text-sm"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-background border-border focus-visible:ring-primary"
                      data-ocid="booking.input"
                    />
                    {errors.name && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="booking.error_state"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-foreground/80 text-sm"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-background border-border focus-visible:ring-primary"
                      data-ocid="booking.input"
                    />
                    {errors.email && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="booking.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-foreground/80 text-sm"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="bg-background border-border focus-visible:ring-primary"
                      data-ocid="booking.input"
                    />
                    {errors.phone && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="booking.error_state"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-foreground">
                    Number of Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      data-ocid="booking.secondary_button"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-display font-black text-3xl text-primary w-12 text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(5, qty + 1))}
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      data-ocid="booking.secondary_button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-muted-foreground text-sm">
                      (max 5)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-lg py-6 shadow-glow"
                disabled={isDisabled}
                data-ocid="booking.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Creating
                    Booking...
                  </>
                ) : !createBooking.isActorReady ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  <>
                    Proceed to Pay <Ticket className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Price Summary */}
            <div className="space-y-4">
              <Card className="bg-card border-primary/20 sticky top-24">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-foreground flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4">
                    <p className="font-display font-semibold text-foreground text-sm">
                      Toto Live: The First Chapter
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Date & Venue: TBA
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {qty} × Early Bird Ticket
                      </span>
                      <span className="text-foreground">
                        ₹{BASE_PRICE * qty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Booking Fee (10%)
                      </span>
                      <span className="text-foreground">
                        ₹{bookingFee.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="bg-border" />
                    <div className="flex justify-between">
                      <span className="font-display font-bold text-foreground">
                        Total
                      </span>
                      <span className="font-display font-black text-primary text-xl">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground bg-background/30 rounded-lg p-3">
                    <p>✓ Instant booking confirmation</p>
                    <p>✓ QR ticket via email</p>
                    <p>✓ PDF download available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
