"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import supabase from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updatedProfile(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  // Xóa cache
  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  // console.log(newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabin/${bookingData.cabinId}`);

  redirect("/account/reservations");
}

export async function deleteReservation(bookingId) {
  // 1) Authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // Xử lý khi ng khác vào xem response cũng xóa đc booking của một ng nào đó
  // Kiểm tra Id của các lượt booking xem có id của ng này không
  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  /////////////////////////////////////////////////////////////////

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  // Xóa cache
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  // 1) Authorization
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // Xử lý khi ng khác vào xem response cũng xóa đc booking của một ng nào đó
  // Kiểm tra Id của các lượt booking xem có id của ng này không
  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingIds = guestBookings.map((booking) => booking.id);

  const bookingId = Number(formData.get("bookingId"));

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  /////////////////////////////////////////////////////////////////

  // Update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // Mutations
  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // Revalidation
  revalidatePath(`/account/reservations/edit$/${bookingId}`);
  revalidatePath("/account/reservations");

  // Error handling
  if (error) throw new Error("Booking could not be updated");

  // Redirecting
  redirect("/account/reservations");
}

export async function signInAction() {
  // Login và chuyển hướng
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  // Logout và chuyển hướng
  await signOut({ redirectTo: "/" });
}
