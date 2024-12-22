import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = ({
  isDarkTheme,
  setIsDarkTheme,
  currentLanguage,
  onLanguageChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const games = [
    { path: "/tictactoe", name: t("ticTacToe"), icon: "❌" },
    { path: "/fizzbuzz", name: t("fizzBuzz"), icon: "🔢" },
    { path: "/hangman", name: t("hangman"), icon: "👻" },
    { path: "/highlow", name: t("highLowCardGame"), icon: "🎴" },
    { path: "/memorygame", name: t("memoryGame"), icon: "🧩" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full ${
        isDarkTheme
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      } backdrop-blur-sm border-b`}
    >
      <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home Link */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-2xl font-bold ${
                isDarkTheme
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              } transition-all duration-300`}
            >
              {t("gameMenu")}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="relative group">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  isDarkTheme
                    ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              >
                {t("games")}
                <svg
                  className={`ml-2 h-5 w-5 transform transition-transform duration-300 ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    isDarkTheme
                      ? "bg-gray-800 ring-1 ring-black ring-opacity-5"
                      : "bg-white ring-1 ring-black ring-opacity-5"
                  }`}
                >
                  <div className="py-1" role="menu">
                    {games.map((game) => (
                      <Link
                        key={game.path}
                        to={game.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group flex items-center px-4 py-3 text-sm ${
                          isDarkTheme
                            ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        } transition-all duration-300`}
                      >
                        <span className="mr-3 text-lg group-hover:scale-125 transition-transform duration-300">
                          {game.icon}
                        </span>
                        {game.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={onLanguageChange}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
              aria-label="Toggle language"
            >
              {currentLanguage.startsWith("es") ? "🇺🇸 EN" : "🇪🇸 ES"}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkTheme
                  ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkTheme ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isDarkTheme
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } focus:outline-none`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className={`px-2 pt-2 pb-3 space-y-1 ${
              isDarkTheme ? "bg-gray-900" : "bg-white"
            }`}
          >
            {games.map((game) => (
              <Link
                key={game.path}
                to={game.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isDarkTheme
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                } transition-all duration-300`}
              >
                <span className="mr-3 text-lg">{game.icon}</span>
                {game.name}
              </Link>
            ))}

            {/* Mobile Language Toggle */}
            <button
              onClick={onLanguageChange}
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              } transition-all duration-300`}
            >
              <span className="mr-3">
                {currentLanguage.startsWith("es")
                  ? "🇺🇸 Switch to English"
                  : "🇪🇸 Cambiar a Español"}
              </span>
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isDarkTheme
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              } transition-all duration-300`}
            >
              <span className="mr-3">
                {isDarkTheme ? t("lightMode") : t("darkMode")}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
