"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faXTwitter,
  faLinkedin,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="theme-page border-t" style={{ borderColor: "var(--border-default)" }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="theme-outline-button flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
          >
            <FontAwesomeIcon icon={faGithub} className="text-lg" />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="theme-outline-button flex h-10 w-10 items-center justify-center rounded-full text-black transition-all duration-300 hover:scale-110 dark:text-white"
          >
            <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="theme-outline-button flex h-10 w-10 items-center justify-center rounded-full text-[#0A66C2] transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="theme-outline-button flex h-10 w-10 items-center justify-center rounded-full text-[#E1306C] transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-lg" />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="theme-outline-button flex h-10 w-10 items-center justify-center rounded-full text-[#FF0000] transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faYoutube} className="text-lg" />
          </a>
        </div>

        <div className="theme-text-soft text-center text-sm tracking-wide sm:text-right">
          © {new Date().getFullYear()} CampusOR. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
