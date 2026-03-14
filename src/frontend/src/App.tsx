import { Toaster } from "@/components/ui/sonner";
import BookingPage from "@/pages/BookingPage";
import LandingPage from "@/pages/LandingPage";
import PaymentPage from "@/pages/PaymentPage";
import TicketPage from "@/pages/TicketPage";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminCheckin from "@/pages/admin/AdminCheckin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster theme="dark" richColors />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookingPage,
});

const payRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pay/$bookingId",
  component: PaymentPage,
});

const ticketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket/$bookingId",
  component: TicketPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboard,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/bookings",
  component: AdminBookings,
});

const adminCheckinRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/checkin",
  component: AdminCheckin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  bookRoute,
  payRoute,
  ticketRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminBookingsRoute,
    adminCheckinRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
