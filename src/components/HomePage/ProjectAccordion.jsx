import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ProjectAccordion({ projects }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {projects.map((project, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-gray-700 rounded overflow-hidden">
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full p-4 background-accordion text-white text-left"
            >
              <h3 className="font-bold text-xl">{project.title}</h3>
              <span className="ml-2 text-sm text-gray-300">
                {isOpen ? '-' : '+'}
              </span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-900"
                >
                  <div className="p-4 text-gray-100">
                    <p className="mb-2">{project.description}</p>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto mb-4 rounded"
                    />
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      View Project
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

export default ProjectAccordion; 