import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = ({
  children,
  isDarkTheme,
  setIsDarkTheme,
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className={`flex-1 flex flex-col ${
          isDarkTheme
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
        }`}
      >
        <Header
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
        <main className="flex-1 w-full relative">{children}</main>
        <Footer isDarkTheme={isDarkTheme} />
      </div>
    </div>
  );
};

export default MainLayout;
