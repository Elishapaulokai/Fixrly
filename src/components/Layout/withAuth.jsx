"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux";
import Loader from "../ReUseableComponents/Loader";
import { useIsLogin } from "@/utils/Helper";
import {
  DEFAULT_APP_PATH,
  getLoginUrl,
  isPrivateRoute,
} from "@/utils/authRoutes";

const withAuth = (WrappedComponent) => {

    const Wrapper = (props) => {

        const router = useRouter();
        const isLoggedIn = useIsLogin();
        const userData = useSelector((state) => state.userData);
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [authChecked, setAuthChecked] = useState(false)

        const isLandingPage = router.pathname === "/home";
        const locationData = useSelector(state => state.location);

        useEffect(() => {
            if (!router.isReady) return;

            const isPrivate = isPrivateRoute(router.pathname);

            if (isPrivate && !isLoggedIn) {
                router.replace(getLoginUrl(router.asPath));
                setIsAuthorized(false);
            } else {
                setIsAuthorized(true);
            }
            setAuthChecked(true);

            if (isLandingPage && locationData?.lat && locationData?.lng) {
                router.replace(DEFAULT_APP_PATH);
            }
        }, [userData, router, isLoggedIn, locationData?.lat, locationData?.lng, isLandingPage])

        if (!authChecked) {
            return <Loader />;
        }

        return isAuthorized ? <WrappedComponent {...props} /> : null;
    }
    return Wrapper;
}

export default withAuth;
