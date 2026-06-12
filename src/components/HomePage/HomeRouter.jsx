"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useIsLogin } from "@/utils/Helper";
import {
  AUTH_ACCOUNT_PATH,
  LANDING_PATH,
} from "@/utils/authRoutes";
import HomePage from "./HomePage";
import Loader from "../ReUseableComponents/Loader";

/**
 * Entry for `/`:
 * - Logged in → account (profile), not landing
 * - Guest, no location → landing (/home)
 * - Guest, has location → service home
 */
const HomeRouter = () => {
  const router = useRouter();
  const isLoggedIn = useIsLogin();
  const locationData = useSelector((state) => state?.location);
  const hasLocation = Boolean(locationData?.lat && locationData?.lng);

  useEffect(() => {
    if (!router.isReady) return;

    if (isLoggedIn) {
      router.replace(AUTH_ACCOUNT_PATH);
      return;
    }

    if (!hasLocation) {
      router.replace(LANDING_PATH);
    }
  }, [router.isReady, isLoggedIn, hasLocation, router]);

  if (!router.isReady) {
    return <Loader />;
  }

  if (isLoggedIn || !hasLocation) {
    return <Loader />;
  }

  return <HomePage />;
};

export default HomeRouter;
