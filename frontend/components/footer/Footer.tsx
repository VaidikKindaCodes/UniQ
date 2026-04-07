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
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-[#181717] transition-all duration-300 hover:bg-slate-100 hover:scale-105"
          >
            <FontAwesomeIcon icon={faGithub} className="text-lg" />
          </a>

          {/* X / Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-700 text-black bg-white hover:bg-slate-100 transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-700 text-[#0A66C2] bg-white hover:bg-slate-100 transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-700 text-[#E1306C] bg-white hover:bg-slate-100 transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-lg" />
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-700 text-[#FF0000] bg-white hover:bg-slate-100 transition-all duration-300 hover:scale-110"
          >
            <FontAwesomeIcon icon={faYoutube} className="text-lg" />
          </a>
        </div>

        <div className="text-center text-sm text-slate-500 tracking-wide sm:text-right">
          © {new Date().getFullYear()} CampusOR. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
