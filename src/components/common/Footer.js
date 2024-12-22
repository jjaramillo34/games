import React from "react";
import { useTranslation } from "react-i18next";

const Footer = ({ isDarkTheme }) => {
  const { t } = useTranslation();

  return (
    <footer
      className={`w-full py-4 ${
        isDarkTheme
          ? "bg-gray-900/80 border-t border-gray-800"
          : "bg-white/80 border-t border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p
            className={`text-sm ${
              isDarkTheme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © 2024 {t("createdBy")} Javier Jaramillo. {t("allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
