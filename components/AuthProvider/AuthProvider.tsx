"use client";
 
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
 
const PRIVATE_ROUTES = ["/profile", "/notes"];
 
interface AuthProviderProps {
  children: ReactNode;
}
 
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
 
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
 
  const verify = useCallback(async () => {
    try {
      const { data } = await checkSession();
      if (data?.success) {
        const { data: user } = await getMe();
        setUser(user);
      } else if (isPrivate) {
        await logout();
        clearIsAuthenticated();
        router.push("/sign-in");
      }
    } catch {
      if (isPrivate) {
        clearIsAuthenticated();
        router.push("/sign-in");
      }
    } finally {
      setLoading(false);
    }
  }, [isPrivate, router, setUser, clearIsAuthenticated]);
 
  useEffect(() => {
    verify();
  }, [verify]);
 
  if (loading) return <div>Loading...</div>;
  if (isPrivate && !isAuthenticated) return null;
 
  return <>{children}</>;
};