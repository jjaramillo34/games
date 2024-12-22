import React from "react";
import { motion } from "framer-motion";

const GameLayout = ({ children, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {title && (
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                {title}
              </motion.h1>
            )}
            {description && (
              <motion.p
                className="text-lg text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default GameLayout;
