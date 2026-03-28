import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PaymentStatus = {
    #pending;
    #confirmed;
    #rejected;
  };

  module PaymentStatus {
    public func toText(status : PaymentStatus) : Text {
      switch (status) {
        case (#pending) { "pending" };
        case (#confirmed) { "confirmed" };
        case (#rejected) { "rejected" };
      };
    };

    public func compare(status1 : PaymentStatus, status2 : PaymentStatus) : Order.Order {
      toText(status1).compare(toText(status2));
    };
  };

  type Booking = {
    bookingId : Text;
    name : Text;
    email : Text;
    phone : Text;
    upiTxnId : Text;
    paymentStatus : PaymentStatus;
    checkedIn : Bool;
    createdAt : Int;
    ticketCount : Nat;
  };

  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      booking1.bookingId.compare(booking2.bookingId);
    };

    public func compareByCreatedAt(booking1 : Booking, booking2 : Booking) : Order.Order {
      compareByCreatedAtAscending(booking2, booking1);
    };

    public func compareByCreatedAtAscending(booking1 : Booking, booking2 : Booking) : Order.Order {
      Int.compare(booking1.createdAt, booking2.createdAt);
    };
  };

  var bookings : [Booking] = [];
  var bookingCounter = 0;

  func generateBookingId() : Text {
    bookingCounter += 1;
    let idNumber = if (bookingCounter < 10) {
      "000" # bookingCounter.toText();
    } else if (bookingCounter < 100) {
      "00" # bookingCounter.toText();
    } else if (bookingCounter < 1000) {
      "0" # bookingCounter.toText();
    } else {
      bookingCounter.toText();
    };
    "TOTO-" # idNumber;
  };

  func createBookingInternal(
    name : Text,
    email : Text,
    phone : Text,
    ticketCount : Nat,
  ) : Booking {
    {
      bookingId = generateBookingId();
      name;
      email;
      phone;
      upiTxnId = "";
      paymentStatus = #pending;
      checkedIn = false;
      createdAt = Time.now();
      ticketCount;
    };
  };

  func filterBookings(searchTerm : Text) : [Booking] {
    let term = searchTerm.toLower();
    bookings.filter(
      func(booking) {
        booking.bookingId.toLower().contains(#text term) or
        booking.name.toLower().contains(#text term) or
        booking.email.toLower().contains(#text term)
      }
    );
  };

  public shared ({ caller }) func createBooking(
    name : Text,
    email : Text,
    phone : Text,
    ticketCount : Nat,
  ) : async Text {
    let booking = createBookingInternal(
      name,
      email,
      phone,
      ticketCount,
    );
    bookings := bookings.concat([booking]);
    booking.bookingId;
  };

  public query ({ caller }) func getBooking(bookingId : Text) : async Booking {
    switch (bookings.find(func(b : Booking) : Bool { b.bookingId == bookingId })) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings;
  };

  public shared ({ caller }) func updatePaymentStatus(bookingId : Text, status : PaymentStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };
    var found = false;
    let updatedBookings = bookings.map(
      func(b : Booking) : Booking {
        if (b.bookingId == bookingId) {
          found := true;
          { b with paymentStatus = status };
        } else { b };
      }
    );
    if (not found) { Runtime.trap("Booking not found") };
    bookings := updatedBookings;
  };

  public shared ({ caller }) func submitUpiTxnId(bookingId : Text, upiTxnId : Text) : async () {
    var found = false;
    let updatedBookings = bookings.map(
      func(b : Booking) : Booking {
        if (b.bookingId == bookingId) {
          found := true;
          { b with upiTxnId = upiTxnId };
        } else { b };
      }
    );
    if (not found) { Runtime.trap("Booking not found") };
    bookings := updatedBookings;
  };

  public shared ({ caller }) func checkInBooking(bookingId : Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can check in bookings");
    };
    var found = false;
    var alreadyCheckedIn = false;
    let updatedBookings = bookings.map(
      func(b : Booking) : Booking {
        if (b.bookingId == bookingId) {
          found := true;
          if (b.checkedIn) {
            alreadyCheckedIn := true;
            b;
          } else {
            { b with checkedIn = true };
          };
        } else { b };
      }
    );
    if (not found) { Runtime.trap("Booking not found") };
    bookings := updatedBookings;
    not alreadyCheckedIn;
  };

  public query ({ caller }) func searchBookings(searchTerm : Text) : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can search bookings");
    };
    filterBookings(searchTerm).sort(Booking.compareByCreatedAt);
  };

  public query ({ caller }) func getBookingsByPaymentStatus(status : PaymentStatus) : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can filter bookings by payment status");
    };
    bookings.filter(
      func(booking : Booking) : Bool {
        booking.paymentStatus == status;
      }
    ).sort(Booking.compareByCreatedAtAscending);
  };
};
