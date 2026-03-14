import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, PaymentStatus } from "../backend.d";
import { useActor } from "./useActor";

export function useGetBooking(bookingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getBooking(bookingId);
    },
    enabled: !!actor && !isFetching && !!bookingId,
    refetchInterval: 10000,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchBookings(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "search", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchBookings(searchTerm);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor, isFetching } = useActor();
  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      ticketCount: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createBooking(
        data.name,
        data.email,
        data.phone,
        "",
        BigInt(data.ticketCount),
      );
    },
  });
  return { ...mutation, isActorReady: !!actor && !isFetching };
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { bookingId: string; status: PaymentStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePaymentStatus(data.bookingId, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCheckInBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.checkInBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
