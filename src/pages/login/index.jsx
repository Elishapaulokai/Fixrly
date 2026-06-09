"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import Loader from "@/components/ReUseableComponents/Loader";
import { useIsLogin } from "@/utils/Helper";
import {
  AUTH_ACCOUNT_PATH,
  getSafeRedirectPath,
} from "@/utils/authRoutes";

const LoginModal = dynamic(() => import("@/components/auth/LoginModal"), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  const isLoggedIn = useIsLogin();

  const redirectTarget = router.isReady
    ? getSafeRedirectPath(router.query.redirect, AUTH_ACCOUNT_PATH)
    : AUTH_ACCOUNT_PATH;

  useEffect(() => {
    if (!router.isReady || !isLoggedIn) return;
    router.replace(redirectTarget);
  }, [router.isReady, isLoggedIn, redirectTarget, router]);

  if (!router.isReady) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (isLoggedIn) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto min-h-[60vh] flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg text-center mb-6">
          <h1 className="text-2xl font-bold primary_text_color">Welcome to Fixrly</h1>
          <p className="mt-2 text-sm description_color">
            Sign in or create an account to book services and manage your profile.
          </p>
        </div>
        <LoginModal
          open
          close={() => router.push("/")}
          redirectTo={redirectTarget}
        />
      </div>
    </Layout>
  );
}
