import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import logo from "../assets/winway1.png";
import MagneticButton from "./animations/MagneticButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Products", href: "#products" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // If at the very bottom, highlight Contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveLink("Contact");
        return;
      }

      const sections = ["home", "services", "products", "contact"];
      let currentSection = "Home";

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSection = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            break;
          }
        }
      }
      setActiveLink(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? -10 : -60,
        filter: shouldReduceMotion ? "none" : "blur(10px)"
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)"
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="fixed top-0 left-0 w-full z-50"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(214, 185, 140, 0.3)",
        boxShadow: "0 2px 20px rgba(91, 70, 54, 0.08)",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8"
        style={{ height: "88px" }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveLink("Home");
          }}
          className="flex items-center gap-2"
        >
          <img
            src={logo}
            alt="Winway Logo"
            style={{
              height: "68px",
              width: "auto",
              filter: "drop-shadow(0 1px 4px rgba(91,70,54,0.08))",
            }}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveLink(link.name)}
                className="relative transition-colors"
                style={{ color: activeLink === link.name ? "#5B4636" : "#7a6153" }}
              >
                {link.name}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: activeLink === link.name ? "100%" : "0%",
                    background: "linear-gradient(to right, #D6B98C, #b8936a)",
                  }}
                />
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setActiveLink(link.name)}
                className="relative transition-colors"
                style={{ color: activeLink === link.name ? "#5B4636" : "#7a6153" }}
              >
                {link.name}
                <span
                  className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width: activeLink === link.name ? "100%" : "0%",
                    background: "linear-gradient(to right, #D6B98C, #b8936a)",
                  }}
                />
              </Link>
            )
          )}
        </div>

        {/* CTA */}
        <MagneticButton className="hidden md:inline-flex">
          <a
            href="#contact"
            className="inline-flex items-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#5B4636] hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
              boxShadow: "0 2px 12px rgba(184,147,106,0.35)",
            }}
          >
            Contact Now
          </a>
        </MagneticButton>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#5B4636" }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "#ffffff",
          borderTop: "1px solid rgba(214,185,140,0.2)",
        }}
      >
        {navLinks.map((link) =>
          link.href.startsWith("#") ? (
            <a
              key={link.name}
              href={link.href}
              onClick={() => { setActiveLink(link.name); setIsOpen(false); }}
              className="flex items-center justify-between px-6 py-4 text-sm font-medium"
              style={{
                color: activeLink === link.name ? "#5B4636" : "#7a6153",
                borderBottom: "1px solid rgba(214,185,140,0.12)",
              }}
            >
              {link.name}
              {activeLink === link.name && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D6B98C" }} />
              )}
            </a>
          ) : (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => { setActiveLink(link.name); setIsOpen(false); }}
              className="flex items-center justify-between px-6 py-4 text-sm font-medium"
              style={{
                color: activeLink === link.name ? "#5B4636" : "#7a6153",
                borderBottom: "1px solid rgba(214,185,140,0.12)",
              }}
            >
              {link.name}
              {activeLink === link.name && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D6B98C" }} />
              )}
            </Link>
          )
        )}
        <div className="px-5 pt-3 pb-5">
          <a
            href="#contact"
            className="flex items-center justify-center w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-widest text-[#5B4636] active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
              boxShadow: "0 2px 12px rgba(184,147,106,0.3)",
            }}
            onClick={() => setIsOpen(false)}
          >
            Contact Now
          </a>
        </div>
      </div>
    </motion.nav>
  );
}