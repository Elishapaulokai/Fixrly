"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../ReUseableComponents/Loader";
import { DEFAULT_APP_PATH } from "@/utils/authRoutes";

/**
 * `/` redirects to the default app page (services).
 */
const HomeRouter = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.replace(DEFAULT_APP_PATH);
  }, [router.isReady, router]);

  return <Loader />;
};

export default HomeRouter;
