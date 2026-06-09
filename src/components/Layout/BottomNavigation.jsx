import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { homeIcon, providersIcon, servicesIcon, loginIcon } from '../ReUseableComponents/Error/Images'
import { useTranslation } from './TranslationContext'
import { getUserData } from '@/redux/reducers/userDataSlice'
import { useIsLogin } from '@/utils/Helper'
import { AUTH_ACCOUNT_PATH, getLoginUrl } from '@/utils/authRoutes'

const BottomNavigation = () => {
    const t = useTranslation();
    const router = useRouter();
    useSelector(getUserData);
    const isLoggedIn = useIsLogin();
    const currentPath = router.pathname;

    const baseNavLinks = [
        {
            icon: homeIcon(),
            text: t('home'),
            link: '/'
        },
        {
            icon: providersIcon(),
            text: t('providers'),
            link: '/providers'
        },
        {
            icon: servicesIcon(),
            text: t('services'),
            link: '/services'
        }
    ];

    const navLinks = [
        ...baseNavLinks,
        isLoggedIn ? {
            icon: loginIcon(),
            text: t('profile'),
            link: AUTH_ACCOUNT_PATH
        } : {
            icon: loginIcon(),
            text: t('login'),
            link: getLoginUrl(AUTH_ACCOUNT_PATH)
        }
    ];

    return (
        <div className='fixed bottom-0 left-0 right-0 grid grid-cols-4 gap-4 w-full card_bg h-[64px] text-[10px] font-normal z-10 md:hidden'>
            {navLinks.map((nav, index) => {
                const isActive =
                    nav.link === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(nav.link.split('?')[0]);

                return (
                    <Link
                        href={nav.link}
                        key={index}
                        className={`flex flex-col items-center gap-1 m-auto ${isActive ? 'primary_text_color font-medium' : 'text-gray-500'
                            }`}
                    >
                        <div className={`flex items-center justify-center  ${isActive ? 'bottom_nav_icon' : 'bottom_nav_icon_white'}`}>
                            {nav?.icon}
                        </div>
                        <p>{nav.text}</p>
                    </Link>
                );
            })}
        </div>
    )
}

export default BottomNavigation
