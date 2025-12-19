"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const toastMessages: Record<string, string> = {
    welcome: "Welcome back!",
    userDeleted : "Your account no longer exists. Please sign in or create a new account.",
    sessionExpired: "Your session has expired. Please sign in again.",
  };

export default function QueryToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;

    let hasToast = false;
    const newParams = new URLSearchParams(searchParams.toString());

    const types: ("message" | "error" | "warning")[] = ["message", "error", "warning"];

    types.forEach((type) => {
      const key = searchParams.get(type);
      if (key && toastMessages[key]) {
        const msg = toastMessages[key];

        // Map URL query to toast type
        if (type === "message") toast.success(msg);
        else if (type === "error") toast.error(msg);
        else if (type === "warning") toast.error(msg); // or toast.warning(msg) if you add later

        newParams.delete(type);
        hasToast = true;
      }
    });

    if (hasToast) {
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      router.replace(newUrl);
    }
  }, [searchParams]);

  return null;
}
