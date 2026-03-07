"use client";
import CommanCenterText from "../ReUseableComponents/CommanCenterText";
import CustomImageTag from "../ReUseableComponents/CustomImageTag";

const Progress = ({ title, desc, data }) => {
  return (
    <section id="progress" className="py-10 md:py-20">
      <div className="container mx-auto">
        <CommanCenterText
          highlightedText={""}
          title={title}
          description={desc}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {data?.map((step, index) => (
            <div
              key={step?.id ?? index}
              className="group relative flex flex-col items-center text-center card_bg border border-black/5 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="h-7 min-w-7 px-2 inline-flex items-center justify-center rounded-full primary_bg_color text-white text-xs font-extrabold shadow">
                  {index + 1}
                </div>
              </div>

              <div className="light_bg_color rounded-2xl mb-4 mt-2 p-4 ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-[1.02] transition-transform">
                <CustomImageTag
                  src={step?.image}
                  alt={step?.title}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h3 className="font-extrabold text-base mb-2 text_color">
                {step?.title}
              </h3>
              <p className="text-sm description_color opacity-80">
                {step?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Progress;
