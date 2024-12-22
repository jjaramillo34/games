import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Home = ({ isDarkTheme }) => {
  const { t } = useTranslation();

  const games = [
    {
      path: "/tictactoe",
      name: t("gameNames.ticTacToe"),
      icon: "❌",
      delay: 0.1,
    },
    {
      path: "/fizzbuzz",
      name: t("gameNames.fizzBuzz"),
      icon: "🔢",
      delay: 0.2,
    },
    { path: "/hangman", name: t("gameNames.hangman"), icon: "👻", delay: 0.3 },
    {
      path: "/highlow",
      name: t("gameNames.highLowCardGame"),
      icon: "🎴",
      delay: 0.4,
    },
    {
      path: "/memorygame",
      name: t("gameNames.memoryGame"),
      icon: "🧩",
      delay: 0.5,
    },
    {
      path: "/numbermaster",
      name: t("gameNames.numberMaster"),
      icon: "🎯",
      delay: 0.6,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: t("homePage.features.modernDesign.emoji"),
      title: t("homePage.features.modernDesign.title"),
      description: t("homePage.features.modernDesign.description"),
    },
    {
      icon: t("homePage.features.trackProgress.emoji"),
      title: t("homePage.features.trackProgress.title"),
      description: t("homePage.features.trackProgress.description"),
    },
    {
      icon: t("homePage.features.multipleModes.emoji"),
      title: t("homePage.features.multipleModes.title"),
      description: t("homePage.features.multipleModes.description"),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.h1
          className={`text-4xl md:text-6xl font-bold mb-6 ${
            isDarkTheme
              ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {t("homePage.welcome")}
        </motion.h1>
        <motion.p
          className={`text-xl ${
            isDarkTheme ? "text-gray-300" : "text-gray-600"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t("homePage.chooseGame")}
        </motion.p>
      </motion.div>

      {/* Games Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
      >
        {games.map((game) => (
          <motion.div key={game.path} variants={itemVariants}>
            <Link
              to={game.path}
              className={`group relative overflow-hidden rounded-xl p-6 ${
                isDarkTheme
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-white/50 hover:bg-gray-50/50"
              } border ${
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              } transition-all duration-300 transform hover:scale-105 hover:shadow-xl block`}
            >
              <div className="flex items-center space-x-4">
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {game.icon}
                </motion.span>
                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkTheme ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {game.name}
                  </h2>
                  <p
                    className={`mt-1 text-sm ${
                      isDarkTheme ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {t("commonActions.play")} {game.name}
                  </p>
                </div>
              </div>

              <motion.div
                className={`absolute inset-0 ${
                  isDarkTheme
                    ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                    : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                }`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <motion.h2
          className={`text-3xl font-bold text-center mb-10 ${
            isDarkTheme
              ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t("features")}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-6 rounded-xl ${
                isDarkTheme
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-white/50 hover:bg-gray-50/50"
              } border ${
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              } transition-all duration-300`}
            >
              <motion.span
                className="text-4xl block mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
              </motion.span>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkTheme ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`${isDarkTheme ? "text-gray-400" : "text-gray-600"}`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Dedication Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`max-w-4xl mx-auto text-center p-8 rounded-xl ${
          isDarkTheme
            ? "bg-gray-800/50 border-gray-700"
            : "bg-white/50 border-gray-200"
        } border relative overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-red-500/20 to-yellow-500/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative z-10">
          <motion.h2
            className={`text-3xl font-bold mb-6 ${
              isDarkTheme
                ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t("homePage.dedication.title")}
          </motion.h2>
          <motion.p
            className={`text-xl mb-6 ${
              isDarkTheme ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {t("homePage.dedication.text")}{" "}
            <motion.span
              className="inline-block"
              whileHover={{ scale: 1.3, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {t("homePage.dedication.emoji")}
            </motion.span>
          </motion.p>
          <motion.p
            className={`text-lg italic ${
              isDarkTheme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("homePage.dedication.quote")}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
