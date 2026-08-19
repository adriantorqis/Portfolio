"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createSessionToken,
} from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password");
  const from = formData.get("from");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    const query = new URLSearchParams({ error: "1" });
    if (typeof from === "string" && from) query.set("from", from);
    redirect(`/admin/login?${query.toString()}`);
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });

  redirect(typeof from === "string" && from.startsWith("/admin") ? from : "/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
