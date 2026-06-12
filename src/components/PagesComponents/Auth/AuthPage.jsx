"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoginModal from "@/components/auth/LoginModal";
import Loader from "@/components/ReUseableComponents/Loader";
import { useIsLogin } from "@/utils/Helper";
import {
  AUTH_ACCOUNT_PATH,
  AUTH_LOGIN_PATH,
  getSafeRedirectPath,
  LANDING_PATH,
} from "@/utils/authRoutes";

const AuthPage = ({ initialMode = "login" }) => {
  const router = useRouter();
  const isLoggedIn = useIsLogin();
  const [ready, setReady] = useState(false);

  const redirectTo = router.isReady
    ? getSafeRedirectPath(router.query?.redirect, AUTH_ACCOUNT_PATH)
    : AUTH_ACCOUNT_PATH;

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);

    if (isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [router.isReady, isLoggedIn, redirectTo, router]);

  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(LANDING_PATH);
  };

  if (!ready || isLoggedIn) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center background_color p-4">
      <LoginModal
        open
        close={handleClose}
        redirectTo={redirectTo}
        initialMode={initialMode}
      />
    </div>
  );
};

export default AuthPage;
