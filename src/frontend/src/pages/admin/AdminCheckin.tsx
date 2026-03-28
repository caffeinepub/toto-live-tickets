import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckInBooking, useGetBooking } from "@/hooks/useQueries";
import { useQRScanner } from "@/qr-code/useQRScanner";
import {
  Camera,
  CameraOff,
  CheckCircle,
  Loader2,
  QrCode,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PaymentStatus } from "../../backend.d";

/** Extract booking ID from either a raw ID or a URL like https://example.com/ticket/BOOKING_ID */
function extractBookingId(raw: string): string {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/");
    const ticketIdx = parts.indexOf("ticket");
    if (ticketIdx !== -1 && parts[ticketIdx + 1]) {
      return parts[ticketIdx + 1];
    }
    // Fall back to last path segment
    const last = parts.filter(Boolean).pop();
    if (last) return last;
  } catch {
    // Not a URL, use as-is
  }
  return trimmed;
}

function ManualCheckin() {
  const [bookingId, setBookingId] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [checkedInName, setCheckedInName] = useState("");
  const { data: booking, isLoading, isError } = useGetBooking(lookupId);
  const checkIn = useCheckInBooking();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      toast.error("Enter a booking ID");
      return;
    }
    setCheckedInName("");
    setLookupId(extractBookingId(bookingId));
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    if (booking.checkedIn) {
      toast.warning("This guest is already checked in!");
      return;
    }
    if (booking.paymentStatus !== PaymentStatus.confirmed) {
      toast.error("Payment not confirmed. Cannot check in.");
      return;
    }
    try {
      const result = await checkIn.mutateAsync(booking.bookingId);
      if (result) {
        setCheckedInName(booking.name);
        toast.success(`✅ ${booking.name} checked in successfully!`);
      } else {
        toast.error("Check-in failed. Please try again.");
      }
    } catch {
      toast.error("Check-in failed. Please try again.");
    }
  };

  const handleCheckAnother = () => {
    setBookingId("");
    setLookupId("");
    setCheckedInName("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLookup} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="Enter booking ID..."
            className="pl-10 bg-card border-border font-mono"
            data-ocid="checkin.input"
          />
        </div>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground"
          data-ocid="checkin.submit_button"
        >
          Look Up
        </Button>
      </form>

      {isLoading && lookupId && (
        <div
          className="flex justify-center py-8"
          data-ocid="checkin.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {(isError || (lookupId && !isLoading && !booking)) && (
        <Card
          className="bg-card border-destructive/30"
          data-ocid="checkin.error_state"
        >
          <CardContent className="py-6 text-center">
            <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-semibold">Booking Not Found</p>
            <p className="text-muted-foreground text-sm mt-1">
              No booking with ID: {lookupId}
            </p>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {checkedInName && (
          <motion.div
            key="success-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <p className="text-green-400 font-bold">
                    {checkedInName} — Checked In!
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Check-in recorded successfully.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCheckAnother}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 shrink-0"
                data-ocid="checkin.secondary_button"
              >
                Check In Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {booking && !isError && !checkedInName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={`bg-card border-2 ${
              booking.checkedIn
                ? "border-green-500/40"
                : booking.paymentStatus === PaymentStatus.confirmed
                  ? "border-primary/30"
                  : "border-destructive/30"
            }`}
          >
            <CardHeader>
              <CardTitle className="font-display text-lg text-foreground flex items-center justify-between">
                <span>{booking.name}</span>
                {booking.checkedIn ? (
                  <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
                    ✓ Checked In
                  </Badge>
                ) : (
                  <Badge className="bg-muted/40 text-muted-foreground border-border">
                    Not Checked In
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">
                    Email
                  </Label>
                  <p className="text-foreground">{booking.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">
                    Phone
                  </Label>
                  <p className="text-foreground">{booking.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">
                    Tickets
                  </Label>
                  <p className="text-foreground font-bold">
                    {booking.ticketCount.toString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase">
                    Payment
                  </Label>
                  <p
                    className={`font-semibold ${
                      booking.paymentStatus === PaymentStatus.confirmed
                        ? "text-green-400"
                        : booking.paymentStatus === PaymentStatus.rejected
                          ? "text-destructive"
                          : "text-secondary"
                    }`}
                  >
                    {booking.paymentStatus}
                  </p>
                </div>
                {booking.upiTxnId && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs uppercase">
                      UPI Txn ID
                    </Label>
                    <p className="text-foreground font-mono text-sm break-all">
                      {booking.upiTxnId}
                    </p>
                  </div>
                )}
              </div>

              {!booking.checkedIn &&
                booking.paymentStatus === PaymentStatus.confirmed && (
                  <Button
                    onClick={handleCheckIn}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold mt-2"
                    disabled={checkIn.isPending}
                    data-ocid="checkin.confirm_button"
                  >
                    {checkIn.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Checking In...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 w-4 h-4" /> Check In Guest
                      </>
                    )}
                  </Button>
                )}
              {!booking.checkedIn &&
                booking.paymentStatus !== PaymentStatus.confirmed && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                    Cannot check in — payment not confirmed.
                  </div>
                )}
              {booking.checkedIn && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Already checked in
                  successfully.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function QRCheckin() {
  const [lastScannedId, setLastScannedId] = useState("");
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkIn = useCheckInBooking();
  const { data: booking, isLoading } = useGetBooking(lastScannedId);

  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading: camLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 300,
    maxResults: 3,
  });

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Process latest QR scan
  useEffect(() => {
    if (qrResults.length === 0) return;
    const latest = qrResults[0];
    const scannedId = extractBookingId(latest.data);
    if (!processedIds.has(scannedId)) {
      setLastScannedId(scannedId);
    }
  }, [qrResults, processedIds]);

  const handleAutoCheckin = async () => {
    if (!booking || !lastScannedId) return;
    if (booking.checkedIn) {
      toast.warning(`${booking.name} is already checked in.`);
      return;
    }
    if (booking.paymentStatus !== PaymentStatus.confirmed) {
      toast.error("Payment not confirmed. Cannot check in.");
      return;
    }
    try {
      const result = await checkIn.mutateAsync(booking.bookingId);
      if (result) {
        toast.success(`✅ ${booking.name} checked in!`);
        setShowSuccess(true);
        setProcessedIds((prev) => new Set([...prev, lastScannedId]));
        clearResults();
        // Auto-reset after 2 seconds so scanner is ready for next guest
        resetTimerRef.current = setTimeout(() => {
          setLastScannedId("");
          setShowSuccess(false);
        }, 2000);
      }
    } catch {
      toast.error("Check-in failed.");
    }
  };

  if (isSupported === false) {
    return (
      <div className="text-center py-12" data-ocid="checkin.error_state">
        <CameraOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="font-semibold text-foreground">Camera not supported</p>
        <p className="text-muted-foreground text-sm">
          Use the manual entry mode instead.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-black border border-border aspect-video max-h-72">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Camera className="w-12 h-12 text-primary/60" />
          </div>
        )}
        {isScanning && (
          <div className="absolute inset-4 border-2 border-primary/50 rounded-lg pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
          </div>
        )}
        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              key="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-green-500/40 flex items-center justify-center"
              data-ocid="checkin.success_state"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-2" />
                <p className="text-white font-bold text-lg">Checked In!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div
          className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive"
          data-ocid="checkin.error_state"
        >
          Camera error: {error.message}
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={startScanning}
            disabled={!canStartScanning || camLoading}
            className="flex-1 bg-primary text-primary-foreground"
            data-ocid="checkin.primary_button"
          >
            {camLoading ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Camera className="mr-2 w-4 h-4" />
            )}
            Start Scanner
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="outline"
            className="flex-1 border-border"
            data-ocid="checkin.secondary_button"
          >
            <CameraOff className="mr-2 w-4 h-4" /> Stop Scanner
          </Button>
        )}
        {isActive &&
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ) && (
            <Button
              variant="outline"
              onClick={switchCamera}
              className="border-border"
              data-ocid="checkin.toggle"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
      </div>

      {isLoading && lastScannedId && (
        <div
          className="flex items-center justify-center gap-2 py-4"
          data-ocid="checkin.loading_state"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm">
            Looking up booking...
          </span>
        </div>
      )}

      {booking && lastScannedId && !isLoading && !showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className={`bg-card border-2 ${
              booking.checkedIn
                ? "border-green-500/40"
                : booking.paymentStatus === PaymentStatus.confirmed
                  ? "border-primary/30"
                  : "border-destructive/30"
            }`}
          >
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-lg text-foreground">
                    {booking.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {booking.email}
                  </p>
                </div>
                <Badge
                  className={`${
                    booking.paymentStatus === PaymentStatus.confirmed
                      ? "bg-green-500/15 text-green-400 border-green-500/30"
                      : "bg-destructive/15 text-destructive border-destructive/30"
                  }`}
                >
                  {booking.paymentStatus}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {booking.ticketCount.toString()} ticket
                  {Number(booking.ticketCount) !== 1 ? "s" : ""}
                </span>
                {booking.upiTxnId && (
                  <span className="text-muted-foreground font-mono text-xs">
                    UPI: {booking.upiTxnId.slice(0, 12)}
                    {booking.upiTxnId.length > 12 ? "…" : ""}
                  </span>
                )}
                {booking.checkedIn && (
                  <span className="text-green-400 font-semibold">
                    ✅ Already checked in
                  </span>
                )}
              </div>

              {!booking.checkedIn &&
                booking.paymentStatus === PaymentStatus.confirmed && (
                  <Button
                    onClick={handleAutoCheckin}
                    className="w-full bg-primary text-primary-foreground font-display font-bold"
                    disabled={checkIn.isPending}
                    data-ocid="checkin.confirm_button"
                  >
                    {checkIn.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                        Checking In...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 w-4 h-4" /> Confirm
                        Check-In
                      </>
                    )}
                  </Button>
                )}
              {!booking.checkedIn &&
                booking.paymentStatus !== PaymentStatus.confirmed && (
                  <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                    ⚠️ Payment not confirmed — cannot check in.
                  </div>
                )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default function AdminCheckin() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-black text-2xl text-foreground mb-1">
          Guest Check-In
        </h2>
        <p className="text-muted-foreground text-sm">
          Verify and check in attendees by booking ID or QR scan
        </p>
      </div>

      <Tabs defaultValue="qr">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="qr"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="checkin.tab"
          >
            <QrCode className="mr-2 w-4 h-4" /> QR Scanner
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            data-ocid="checkin.tab"
          >
            <Search className="mr-2 w-4 h-4" /> Manual
          </TabsTrigger>
        </TabsList>
        <TabsContent value="qr" className="mt-6">
          <QRCheckin />
        </TabsContent>
        <TabsContent value="manual" className="mt-6">
          <ManualCheckin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
