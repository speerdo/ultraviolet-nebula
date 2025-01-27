import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
              onClick={() => toggle(index)}
              className="flex flex-col md:flex-row md:items-center justify-between w-full p-4 background-accordion text-white text-left"
            >
              <h3 className="company-name text-xl mb-2 md:mb-0">{experience.company}</h3>
              <p className="mb-0 flex flex-col md:flex-row md:items-center">
                <span className="text-sm text-gray-300 mb-1 md:mb-0 md:mr-4">
                  {experience.dates}
                </span>
                <span className="text-sm text-gray-300">
                  {isOpen ? '-' : '+'}
                </span>
              </p>
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
                    
                    <p className="mb-8">{experience.description}</p>
                    <div className="flex justify-start mb-8">                      
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-1/4 h-auto rounded"
                      />
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