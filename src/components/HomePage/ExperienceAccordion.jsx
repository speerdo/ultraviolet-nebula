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
              className="flex items-center justify-between w-full p-4 background-accordion text-white text-left"
            >
              <h3 className="company-name mb-0">{experience.company}</h3>
              <p className="mb-0">
                <span className="mr-4 text-sm text-gray-300 text-right uppercase">
                  {experience.dates}
                </span>
                <span className="ml-2 text-sm text-gray-300">
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
                    <h3 className="mb-2">{experience.title}</h3>
                    
                    <p className="mb-2">{experience.description}</p>
                    <div className="flex justify-start">                      
                      <img
                        src={experience.image}
                        alt={experience.title}
                        className="w-1/4 h-auto mb-4 rounded"
                      />
                    </div>
                    <a
                      href={experience.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      View Details
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