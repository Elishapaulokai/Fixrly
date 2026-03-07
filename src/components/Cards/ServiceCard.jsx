"use client"
import React from 'react'
import CustomImageTag from '../ReUseableComponents/CustomImageTag'

const ServiceCard = ({ data }) => {
    return (
        <>
            <div className="service_card group card_bg border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 py-[30px] px-[24px] rounded-[22px] flex flex-col gap-4 items-center justify-center h-[230px] w-full text-center">
                <div className="service_item_img_div bg-white/80 dark:bg-white/10 rounded-[16px] p-2 ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-[1.02] transition-transform">
                <CustomImageTag 
                src={data?.image} 
                alt={data?.name}
                className='w-[76px] sm:w-[82px] aspect-square object-contain' 
                />
                </div>
                <div className="service_title font-extrabold text-[15px] sm:text-base w-full text-center leading-snug">
                    <span className="line-clamp-2">{data?.name}</span>
                </div>
            </div>
        </>
    )
}

export default ServiceCard