// src/hooks/useAuth.ts
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    try {
      console.log("🔐 Login boshlanmoqda:", username);

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log(" Result:", result);

      if (result?.error) {
        console.error("Login xatosi:", result.error);
        alert(result.error || "Login failed");
        return false;
      }

      if (result?.ok) {
        console.log("✅ Login muvaffaqiyatli");
        router.push("/complex");
        router.refresh();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Catch xatosi:", error);
      alert("Login failed. Check console for details.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    session,
    user: session?.user,
    status,
    isLoading,
    login,
    logout,
    isAuthenticated: status === "authenticated",
  };
}