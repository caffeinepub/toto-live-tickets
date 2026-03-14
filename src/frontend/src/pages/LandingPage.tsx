import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Mic2,
  Star,
  Ticket,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const BASE_PRICE = 99;
const BOOKING_FEE_PCT = 0.1;
const BOOKING_FEE = Math.round(BASE_PRICE * BOOKING_FEE_PCT * 100) / 100;
const TOTAL = BASE_PRICE + BOOKING_FEE;

const features = [
  {
    icon: Mic2,
    title: "Solo Stand-Up Special",
    desc: "90 minutes of uninterrupted comedy",
  },
  {
    icon: Zap,
    title: "Early Bird Price",
    desc: "Limited seats at ₹99 — grab yours now",
  },
  {
    icon: Ticket,
    title: "Digital QR Ticket",
    desc: "Instant ticket via email with QR code",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    text: "Toto is absolutely hilarious. Cannot wait for the first chapter!",
    rating: 5,
  },
  {
    name: "Rahul M.",
    text: "Been following Toto's sets for 2 years. This show is going to be legendary.",
    rating: 5,
  },
  {
    name: "Ananya K.",
    text: "Finally a dedicated show! Grabbed my early bird ticket immediately.",
    rating: 5,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic2 className="text-primary w-5 h-5" />
            <span className="font-display font-bold text-foreground text-sm tracking-wide uppercase">
              Toto Live
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => navigate({ to: "/book" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            data-ocid="nav.primary_button"
          >
            Book Now
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-toto-live.dim_1200x600.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="absolute inset-0 bg-background/75" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.85 0.20 95 / 0.10) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 text-xs font-semibold tracking-widest uppercase px-4 py-1.5">
              <Zap className="w-3 h-3 mr-1.5 inline" />
              Early Bird Tickets Available
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            <h1 className="font-display font-extrabold leading-none tracking-tight text-foreground">
              <span className="block text-6xl sm:text-8xl md:text-[9rem] text-primary drop-shadow-[0_0_40px_oklch(0.85_0.20_95/0.4)]">
                TOTO
              </span>
              <span className="block text-3xl sm:text-5xl md:text-6xl text-foreground/90 mt-2">
                LIVE
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-display text-secondary font-medium tracking-wide">
              The First Chapter
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Date: TBA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>Time: TBA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Venue: TBA</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 inline-block bg-card border border-primary/20 rounded-2xl px-8 py-6"
          >
            <div className="flex items-baseline gap-2 justify-center">
              <span className="text-4xl font-display font-black text-primary">
                ₹{BASE_PRICE}
              </span>
              <span className="text-muted-foreground text-sm">
                base + ₹{BOOKING_FEE} booking fee
              </span>
            </div>
            <p className="text-foreground/70 text-sm mt-1">
              Total:{" "}
              <span className="text-foreground font-semibold">₹{TOTAL}</span>{" "}
              per ticket
            </p>
            <Badge className="mt-2 bg-secondary/15 text-secondary border-secondary/30 text-xs">
              🐣 Early Bird Price
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate({ to: "/book" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-lg px-10 py-6 animate-pulse-glow shadow-glow"
              data-ocid="hero.primary_button"
            >
              <Ticket className="mr-2 w-5 h-5" />
              Book Your Seat
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-widest">
              About the Show
            </Badge>
            <h2 className="font-display font-black text-4xl md:text-5xl text-foreground leading-tight mb-6">
              One night.
              <br />
              <span className="text-primary">Unlimited laughs.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Toto returns to the stage for the first time in a solo special —
              "The First Chapter". Expect sharp observations, absurd
              storytelling, and the kind of comedy that makes you laugh until it
              hurts.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is just the beginning. Don't miss the chapter that starts it
              all.
            </p>
          </div>
          <div className="space-y-4">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">
              What fans are saying
            </h2>
            <p className="text-muted-foreground">The hype is real.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={`${t.name}-star-${j}`}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <p className="text-muted-foreground text-xs font-semibold">
                  {t.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display font-black text-4xl md:text-5xl text-foreground mb-4">
            Ready to <span className="text-primary">laugh</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Early bird seats are limited. Secure yours before they're gone.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: "/book" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-lg px-10 py-6 shadow-glow"
            data-ocid="cta.primary_button"
          >
            Get Your Ticket <ChevronRight className="ml-1 w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mic2 className="text-primary w-4 h-4" />
            <span className="font-display font-bold text-sm text-foreground">
              Toto Live: The First Chapter
            </span>
          </div>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin" })}
            className="text-muted-foreground/40 hover:text-muted-foreground text-xs transition-colors"
            data-ocid="nav.link"
          >
            Admin
          </button>
        </div>
      </footer>
    </div>
  );
}
