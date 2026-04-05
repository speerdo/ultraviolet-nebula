import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function ExperienceAccordion({ experiences }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {experiences.map((experience, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-gray-700 rounded overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full cursor-pointer flex-col gap-2 p-4 text-left text-white background-accordion md:flex-row md:items-center md:justify-between md:gap-4"
            >
              <h3 className="company-name m-0! shrink-0 text-xl">{experience.company}</h3>
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-0 md:ml-auto">
                <span className="text-sm text-gray-300 md:mr-4">{experience.dates}</span>
                <span className="text-sm text-gray-300 tabular-nums" aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  layout
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-900"
                >
                  <div className="p-4 text-gray-100">
                    <h3 className="mb-4 mt-4">{experience.title}</h3>
                    
                    <p className="mb-4">{experience.description}</p>
                    
                    {experience.bullets && experience.bullets.length > 0 && (
                      <ul className="mb-8 pl-4 space-y-2">
                        {experience.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-gray-200 flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="flex justify-start mb-8">
                      <div className="w-1/4 h-28 rounded overflow-hidden flex items-center">
                        <img
                          src={experience.image}
                          alt={experience.title}
                          className="w-full h-full object-contain object-center rounded"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <a
                      href={experience.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link"
                    >
                      Company Website
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default ExperienceAccordion; 
