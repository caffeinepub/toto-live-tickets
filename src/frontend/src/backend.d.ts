import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    paymentStatus: PaymentStatus;
    bookingId: string;
    name: string;
    createdAt: bigint;
    ticketCount: bigint;
    email: string;
    checkedIn: boolean;
    phone: string;
    upiTxnId: string;
}
export enum PaymentStatus {
    pending = "pending",
    rejected = "rejected",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkInBooking(bookingId: string): Promise<boolean>;
    createBooking(name: string, email: string, phone: string, upiTxnId: string, ticketCount: bigint | null): Promise<string>;
    getAllBookings(): Promise<Array<Booking>>;
    getBooking(bookingId: string): Promise<Booking>;
    getBookingsByPaymentStatus(status: PaymentStatus): Promise<Array<Booking>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    searchBookings(searchTerm: string): Promise<Array<Booking>>;
    updatePaymentStatus(bookingId: string, status: PaymentStatus): Promise<void>;
}
