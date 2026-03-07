import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const FaqAccordion = ({ faq }) => {
  const [openItem, setOpenItem] = useState(null);

  const toggleFAQ = (index) => {
    setOpenItem((prev) => (prev === index ? null : index));
  };

  const translatedQuestion = faq?.translated_question ? faq?.translated_question : faq?.question;
  const translatedAnswer = faq?.translated_answer ? faq?.translated_answer : faq?.answer;
  return (
    <div key={faq?.id} className="w-full">
      <div className="accordion w-full card_bg border border-black/10 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className={`accordion_header w-full flex items-center justify-between gap-4 p-5 text-left transition-colors duration-300 ease-in-out ${
            openItem === faq?.id
              ? "bg-[#29363F] text-white"
              : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
          }`}
          onClick={() => toggleFAQ(faq?.id)}
          aria-expanded={openItem === faq?.id}
          aria-controls={`faq-${faq?.id}`}
        >
          <span className={`text-[15px] sm:text-base font-semibold ${openItem !== faq?.id ? "line-clamp-1" : ""}`}>
            {translatedQuestion}
          </span>

          {openItem === faq?.id ? (
            <FaMinus size={18} className="shrink-0 text-white" />
          ) : (
            <FaPlus size={18} className="shrink-0 text-black dark:text-white" />
          )}
        </button>

        <div
          id={`faq-${faq?.id}`}
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            openItem === faq?.id ? "max-h-[600px]" : "max-h-0"
          }`}
        >
          <div className="p-5 text-sm sm:text-[15px] description_text opacity-80 font-normal">
            {translatedAnswer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;
