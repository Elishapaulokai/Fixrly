"use client"
import { useState, useEffect } from "react";
import LocationModal from "../ReUseableComponents/LocationModal";
import { useDispatch } from "react-redux";
import { setIsBrowserSupported } from "@/redux/reducers/locationSlice";
import SearchLocationBox from "../ReUseableComponents/SearchLocationBox/SearchLocationBox";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import { useTranslation } from "../Layout/TranslationContext";

const MainLocation = ({ landingPageBg, landingPageLogo, title }) => {
  const t = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const handleClose = ()=> setIsModalOpen(false)
  
  // Handle current location detection from SearchLocationBox
  const handleCurrentLocationDetected = (location) => {
    setCurrentLocation(location);
  };
  
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    } else {
      console.log("This browser does not support desktop notifications.");
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      dispatch(setIsBrowserSupported(false));
      return;
    }
   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          dispatch(setIsBrowserSupported(true));
        },
        (error) => {
          console.error("Geolocation error:", error);
          dispatch(setIsBrowserSupported(true));
        }
      );
    } else {
      console.log("Geolocation not supported");
      dispatch(setIsBrowserSupported(true));
    }
  }, [dispatch]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[720px]">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: landingPageBg ? `url(${landingPageBg})` : undefined }}
          />

          {/* Readability overlay + subtle accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="container relative mx-auto h-full">
            <div className="flex items-center justify-between pt-6 sm:pt-10">
              <div className="w-[160px] sm:w-[190px]">
                <CustomImageTag
                  alt="logo"
                  className="h-[44px] sm:h-[54px] w-auto object-contain"
                  src={landingPageLogo}
                />
              </div>

              <a
                href="/become-provider"
                className="hidden sm:inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Become a provider
              </a>
            </div>

            <div className="flex min-h-[420px] sm:min-h-[520px] lg:min-h-[680px] items-center">
              <div className="w-full max-w-3xl py-10 sm:py-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Trusted local services
                </div>

                <h1 className="mt-4 text-balance text-[28px] sm:text-[38px] lg:text-[52px] font-extrabold leading-tight text-white">
                  {title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/80">
                  Choose your location to discover nearby services and book in minutes.
                </p>

                <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-3 sm:p-4 backdrop-blur">
                  <SearchLocationBox
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onCurrentLocationDetected={handleCurrentLocationDetected}
                  />

                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <a
                      href="#our_service"
                      className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      Browse services
                    </a>
                    <a
                      href="/become-provider"
                      className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-transparent px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                      Become a provider
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <LocationModal 
          open={isModalOpen} 
          onClose={handleClose}
          redirectToHome={true} // ✅ New: Redirect to home page when location is confirmed
          forceChooseAddressOnOpen={true}
          initialLocation={currentLocation} // ✅ Pass current location to modal
        />
      )}
    </>
  );
};

export default MainLocation;
