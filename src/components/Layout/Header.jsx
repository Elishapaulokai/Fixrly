"use client";
import {
  Sheet, SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { logoutApi, getLanguageJsonDataApi } from "@/api/apiRoutes";
import { useLanguage } from "@/hooks/useLanguage";
import { useCart } from "@/hooks/useCart";
import {
  clearCart,
  selectTotalItems,
} from "@/redux/reducers/cartSlice";
import { clearUserData, getUserData } from "@/redux/reducers/userDataSlice";
import {
  useIsLogin, useRTL
} from "@/utils/Helper";
import { useDispatch, useSelector } from "react-redux";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";
import EditProfileModal from "../auth/EditProfile";
import LoginModal from "../auth/LoginModal";
import TopHeader from "./TopHeader";
import CartDialog from "../ReUseableComponents/Dialogs/CartDialog";
import { usePathname } from "next/navigation";
import AccountDialog from "../ReUseableComponents/Dialogs/AccountDialog";
import { useRouter } from "next/router";
import { useTranslation } from "./TranslationContext";
import { selectReorderMode } from "@/redux/reducers/reorderSlice";
import LogoutDialog from "../ReUseableComponents/Dialogs/LogoutDialog";
import FirebaseData from "@/utils/Firebase";
import { useTheme } from "next-themes";
import config from "@/utils/Langconfig";
import { setTheme } from "@/redux/reducers/themeSlice";
import { setTranslations, setLanguage as setReduxLanguage } from "@/redux/reducers/translationSlice";
import toast from "react-hot-toast";
import RegisterAsProviderModal from "../auth/RegisterAsProviderModal";
import CustomLink from "../ReUseableComponents/CustomLink";
import { logClarityEvent } from "@/utils/clarityEvents";
import { AUTH_EVENTS } from "@/constants/clarityEventNames";
// Lazy load sidebar content for better performance
const SidebarContent = lazy(() => import("./SidebarContent"));

const Header = () => {
  const t = useTranslation();
  const router = useRouter();
  const isRTL = useRTL();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { signOut } = FirebaseData();
  const userData = useSelector(getUserData);
  const settingsData = useSelector((state) => state?.settingsData);
  const websettings = settingsData?.settings?.web_settings;
  // Get FCM token from userDataSlice (not settingsData)
  const fcmToken = useSelector((state) => state?.userData?.fcmToken);
  const isLoggedIn = useIsLogin(); // Reactive hook - automatically updates when login state changes
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalIsOpen] = useState(false);
  const [isRegisterAsProviderModalOpen, setRegisterAsProviderModalIsOpen] = useState(false);
  const [cartVisibleDeskTop, setCartVisibleDeskTop] = useState(false);
  const [cartVisibleMobile, setCartVisibleMobile] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const isRegisterAsProviderAllow = websettings?.register_provider_from_web_setting_status === 1;

  const [dropdownStates, setDropdownStates] = useState({
    account: false,
  });

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const defaultLang = useSelector((state) => state.translation.defaultLanguage);

  const isCheckoutPage = pathName === "/checkout";
  const isCartPage = pathName === "/cart";
  const isBecomeProviderPage = pathName === "/become-provider";

  // Access total item count using the selector
  const totalItems = useSelector(selectTotalItems);

  const isReorder = useSelector(selectReorderMode);

  const handleOpen = () => {
    setLoginModalIsOpen(true);
    setIsDrawerOpen(false);
  };

  const handleOpenRegisterAsProviderModal = () => {
    setRegisterAsProviderModalIsOpen(true);
    setIsDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const fcmId = userData?.web_fcm_id;

  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await logoutApi({ fcm_id: fcmId });
    if (response?.error === false) {
      setOpenLogoutDialog(false);
      dispatch(clearUserData());
      dispatch(clearCart());
      signOut();
      router.push("/");
      toast.success(response?.message);
      // Log logout only after the server confirms the session is closed.
      logClarityEvent(AUTH_EVENTS.LOGOUT, {
        user_id: userData?.id,
        reason: "user_initiated",
      });
    } else {
      toast.error(t("somethingWentWrong"));
    }
  };

  const handleOpenLogoutDialog = (e) => {
    e.preventDefault();
    setOpenLogoutDialog(true);
  };

  // Use React Query hook for cart data - this will cache the data and prevent multiple API calls
  // The hook automatically updates Redux store when cart data is fetched
  // enabled: false when in reorder mode or checkout page to prevent unnecessary calls
  const { isLoading: isLoadingCart } = useCart({
    enabled: isLoggedIn && !isReorder && !isCheckoutPage,
  });



  // topHeader functions and states 

  const [isOpen, setIsOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  const { theme, setTheme: setNextTheme } = useTheme();
  const currentLanguage = useSelector((state) => state.translation.currentLanguage);
  const selectedLanguage = useSelector((state) => state.translation.selectedLanguage?.langCode || currentLanguage?.langCode);

  // Use React Query hook for languages - this will cache the data and only fetch once
  // The hook uses staleTime: Infinity, so it won't refetch unless manually invalidated
  // This ensures the API is only called once and shared across all components
  const { languages = [], isLoading: isLoadingLangs, error: langError } = useLanguage();
  
  // Fallback to config languages if API fails
  const displayLanguages = langError && languages.length === 0 ? config.supportedLanguages : languages;

  useEffect(() => {
    document.documentElement.dir = currentLanguage.isRtl ? "rtl" : "ltr";
  }, [currentLanguage.isRtl]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setNextTheme(newTheme);
    dispatch(setTheme(newTheme));
    logClarityEvent(AUTH_EVENTS.THEME_CHANGED, {
      theme: newTheme,
    });
  };

  // Function to update URL with language parameter using Next.js router
  const updateUrlWithLanguage = (langCode) => {
    try {
      // Get current query parameters
      const currentQuery = { ...router.query };
      
      // Add or update the lang parameter
      currentQuery.lang = langCode;
      
      // Update the URL without causing a page reload
      router.replace(
        {
          pathname: router.pathname,
          query: currentQuery
        },
        undefined,
        { shallow: true } // Use shallow routing to avoid page reload
      );
      
    } catch (error) {
      console.error('Error updating URL with language parameter:', error);
    }
  };

  const handleLanguageChange = async (value) => {
    try {
      setIsOpen(false);
      setIsMobileLangOpen(false);
      
      const langObject = displayLanguages.find(
        (lang) => lang.langCode.toLowerCase() === value.toLowerCase()
      );

      if (!langObject) {
        throw new Error('Language not found');
      }

      // First load translations
      const response = await getLanguageJsonDataApi({
        language_code: langObject.langCode,
        platform: "web",
        fcm_id: fcmToken
      });

      if (response?.data) {
        // Update Redux state synchronously
        dispatch(setReduxLanguage(langObject));
        dispatch(setTranslations(response.data));
        
      logClarityEvent(AUTH_EVENTS.LANGUAGE_CHANGED, {
        language_code: langObject.langCode,
        language_label: langObject.language,
      });
        
        // Update document direction
        document.documentElement.dir = langObject.isRtl ? "rtl" : "ltr";

        // Update URL
        const currentQuery = { ...router.query };
        currentQuery.lang = langObject.langCode;
        router.replace(
          {
            pathname: router.pathname,
            query: currentQuery
          },
          undefined,
          { shallow: true }
        );
      } else {
        throw new Error('No translation data received');
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error(t("errorLoadingTranslations"));
    }
  };

  // Memoized language display to prevent unnecessary recalculations
  const getCurrentLanguageDisplay = useMemo(() => {
    if (isLoadingLangs) return t("loading");
    if (langError) return t("error");

    const lang = displayLanguages.find(
      (lang) => lang.langCode === selectedLanguage
    );
    return lang?.language || t("selectLanguage");
  }, [isLoadingLangs, langError, displayLanguages, selectedLanguage, t]);

  const handleMobileNav = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }


  return (
    <header className="w-full sticky top-0 z-50 card_bg dark:bg-gray-900 !border-b !border-[#21212114] shadow-[0px_15px_47px_0px_rgba(0,0,0,0.04)]">
      <div>
        {/* Top header */}
        <TopHeader />

        {/* Main header */}
        <div className="safari-header w-full card_bg py-4 px-4 flex justify-between items-center flex-wrap md:flex-nowrap h-16 md:h-max">
          <div className="container mx-auto flex justify-between items-center">
            <CustomLink href="/" title={t("home")} className="relative">
              <CustomImageTag
                src={websettings?.web_logo}
                alt={t("logo")}
                className="h-[40px] md:h-[60px] aspect-logo max-w-[220px] safari-logo"
              />
            </CustomLink>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 text_color">
              <CustomLink
                href="/"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${pathName === "/" ? "primary_text_color" : ""
                  }`}
                title={t("home")}
              >
                {t("home")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${pathName === "/" ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                ></span>
              </CustomLink>

              <CustomLink
                href="/services"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${pathName === "/services" ? "primary_text_color" : ""
                  }`}
                title={t("services")}
              >
                {t("services")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${pathName === "/services"
                    ? "w-3/4"
                    : "w-0 group-hover:w-3/4"
                    }`}
                ></span>
              </CustomLink>

              <CustomLink
                href="/providers"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${pathName === "/providers" ? "primary_text_color" : ""
                  }`}
                title={t("providers")}
              >
                {t("providers")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${pathName === "/providers"
                    ? "w-3/4"
                    : "w-0 group-hover:w-3/4"
                    }`}
                ></span>
              </CustomLink>

              <CustomLink
                href="/about-us"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${pathName === "/about-us" ? "primary_text_color" : ""
                  }`}
                title={t("aboutUs")}
              >
                {t("aboutUs")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${pathName === "/about-us" ? "w-3/4" : "w-0 group-hover:w-3/4"
                    }`}
                ></span>
              </CustomLink>

              <CustomLink
                href="/contact-us"
                className={`relative group text-base font-normal hover:primary_text_color transition-colors ${pathName === "/contact-us" ? "primary_text_color" : ""
                  }`}
                title={t("contactUs")}
              >
                {t("contactUs")}
                <span
                  className={`absolute left-1/2 -bottom-1  h-0.5 primary_bg_color transition-all duration-300 ease-in-out transform -translate-x-1/2 ${pathName === "/contact-us"
                    ? "w-3/4"
                    : "w-0 group-hover:w-3/4"
                    }`}
                ></span>
              </CustomLink>
            </nav>

            {isLoggedIn ? (
              <div
                className={`hidden lg:flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""
                  }`}
              >

                {isBecomeProviderPage && isRegisterAsProviderAllow && 
                  <button
                    onClick={handleOpenRegisterAsProviderModal}
                    className="bg-[#29363F] px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:primary_bg_color transition-all duration-300">
                    {t("registerAsProvider")}
                  </button>
                }
                {/* Cart Dialog - Single Instance */}
                {!isCheckoutPage && !isCartPage && (
                  <div className="relative">
                    <CartDialog
                      totalItems={totalItems}
                      isVisible={cartVisibleDeskTop}
                      onOpenChange={setCartVisibleDeskTop}
                    />
                  </div>
                )}
                <div className="relative">
                  <AccountDialog
                    userData={userData}
                    handleLogout={handleOpenLogoutDialog}
                    isVisible={accountVisible}
                    onOpenChange={setAccountVisible}
                  />
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                {isBecomeProviderPage && isRegisterAsProviderAllow ? (
                  <button
                    onClick={handleOpenRegisterAsProviderModal}
                    className="bg-[#29363F] px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:primary_bg_color transition-all duration-300">
                    {t("registerAsProvider")}
                  </button>
                ) : (
                  <button
                    className="primary_bg_color px-4 py-2 text-white rounded-lg"
                    onClick={handleOpen}
                  >
                    {t("login")}
                  </button>
                )}

              </div>
            )}

            {/* Hamburger / Close Icon */}
            <div className="flex items-center gap-4 md:hidden">
              {isLoggedIn && !isCheckoutPage && !isCartPage && (
                <CustomLink href={'/cart'}>

                  <div
                    className="relative text-white primary_bg_color h-[36px] w-[36px] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
                  >
                    <FaShoppingCart
                      size={18}
                      className={`${isRTL ? "transform scale-x-[-1]" : ""}`}
                    />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {totalItems}
                      </span>
                    )}

                  </div>
                </CustomLink>
              )}

              <button
                className="relative w-6 h-5 flex flex-col justify-between md:hidden"
                onClick={() => handleMobileNav()}
              >
                <span
                  className={`block h-[2px] w-6 bg-black dark:bg-white rounded transition-transform duration-300 ${isDrawerOpen ? "rotate-45 translate-y-[8px]" : ""
                    }`}
                ></span>
                <span
                  className={`block h-[2px] w-6 bg-black dark:bg-white rounded transition-opacity duration-300 ${isDrawerOpen ? "opacity-0" : "opacity-100"
                    }`}
                ></span>
                <span
                  className={`block h-[2px] w-6 bg-black dark:bg-white rounded transition-transform duration-300 ${isDrawerOpen ? "-rotate-45 -translate-y-2.5" : ""
                    }`}
                ></span>
              </button>
            </div>

            {/* Mobile Navigation Toggle */}

            <div className="hidden lg:hidden md:flex items-center space-x-4">
              {isLoggedIn && !isCheckoutPage && !isCartPage && (
                <div className={`relative ${isRTL ? "ml-2" : ""}`}>
                  <CartDialog
                    totalItems={totalItems}
                    isVisible={cartVisibleMobile}
                    onOpenChange={setCartVisibleMobile}
                  />
                </div>
              )}
              <Sheet
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                side={isRTL ? "left" : "right"}
              >
                <SheetTrigger asChild>
                  <button
                    className="description_color dark:text-white"
                    onClick={toggleDrawer}
                  >
                    <FaBars size={24} />
                  </button>
                </SheetTrigger>
                {/* Drawer Content - Opens from Right */}
                <SheetContent className="w-[85%] sm:w-[350px] p-0">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                  }>
                    <SidebarContent
                      t={t}
                      pathName={pathName}
                      userData={userData}
                      isLoggedIn={isLoggedIn}
                      isBecomeProviderPage={isBecomeProviderPage}
                      isRegisterAsProviderAllow={isRegisterAsProviderAllow}
                      handleOpen={handleOpen}
                      handleOpenRegisterAsProviderModal={handleOpenRegisterAsProviderModal}
                      handleOpenLogoutDialog={handleOpenLogoutDialog}
                      toggleDropdown={toggleDropdown}
                      dropdownStates={dropdownStates}
                      router={router}
                      // Language props
                      languages={displayLanguages}
                      isLoadingLangs={isLoadingLangs}
                      langError={langError}
                      selectedLanguage={selectedLanguage}
                      getCurrentLanguageDisplay={getCurrentLanguageDisplay}
                      handleLanguageChange={handleLanguageChange}
                      isMobileLangOpen={isMobileLangOpen}
                      setIsMobileLangOpen={setIsMobileLangOpen}
                      // Theme props
                      theme={theme}
                      toggleTheme={toggleTheme}
                      // Web settings
                      websettings={websettings}
                    />
                  </Suspense>
                </SheetContent>
              </Sheet>
            </div>

          </div>



        </div>
      </div>
      {isLoginModalOpen && (
        <LoginModal
          open={isLoginModalOpen}
          close={() => setLoginModalIsOpen(false)}
          setOpenProfileModal={setOpenProfileModal}
        />
      )}
      {openProfileModal && (
        <EditProfileModal
          open={openProfileModal}
          close={() => setOpenProfileModal(false)}
          isEditProfile={false}

        />
      )}

      {openLogoutDialog && (
        <LogoutDialog
          isOpen={openLogoutDialog}
          onClose={() => setOpenLogoutDialog(false)}
          onLogout={handleLogout}
        />
      )}
      {isRegisterAsProviderModalOpen && (
        <>
          <RegisterAsProviderModal
            isOpen={isRegisterAsProviderModalOpen}
            onClose={() => {
              setRegisterAsProviderModalIsOpen(false);
            }}
          />
        </>
      )}
    </header>
  );
};

export default Header;


