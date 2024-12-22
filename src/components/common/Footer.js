import React from "react";
import { useTranslation } from "react-i18next";

const Footer = ({ isDarkTheme }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full py-4 ${
        isDarkTheme
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      } backdrop-blur-sm border-t`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p
            className={`text-sm ${
              isDarkTheme ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © {currentYear} {t("footer.createdBy")} Javier Jaramillo.{" "}
            {t("footer.allRightsReserved")}.
          </p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <a
              href="https://github.com/javierjaramillo"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${
                isDarkTheme
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors duration-300`}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/javierjaramillo"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${
                isDarkTheme
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors duration-300`}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
