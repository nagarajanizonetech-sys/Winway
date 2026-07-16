import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import logo from "../assets/winway1.webp";
import MagneticButton from "./animations/MagneticButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Products", href: "#products" },
    { name: "Contact", href: "#contact" },
  ];

  /** Smooth-scroll to a hash section and close mobile menu */
  const handleNavClick = (linkName: string, href: string) => {
    setActiveLink(linkName);
    setIsOpen(false);
    // Give the menu time to close before scrolling
    setTimeout(() => {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  };

  const isVisibleRef = useRef(isVisible);
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    let rAFId: number | null = null;

    const handleScroll = () => {
      if (rAFId) return;

      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        const currentScrollY = window.scrollY;

        // Hide / show logic based on scroll direction
        const nextVisible = !(currentScrollY > lastScrollY.current && currentScrollY > 100);
        if (nextVisible !== isVisibleRef.current) {
          setIsVisible(nextVisible);
        }
        lastScrollY.current = currentScrollY;

        // If at the very bottom, highlight Contact
        if (window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 60) {
          setActiveLink("Contact");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for active section spying (ScrollSpy)
    const sections = ["home", "services", "products", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -40% 0px", // Trigger when elements are in the top-middle of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (rAFId) cancelAnimationFrame(rAFId);
    };
  }, []);

  const showNav = isVisible || isOpen;

  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? -10 : -40,
      }}
      animate={{
        opacity: showNav ? 1 : 0,
        y: showNav ? 0 : -100,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="fixed top-4 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pointer-events-none"
    >
      <div className="max-w-[1520px] mx-auto flex items-center justify-between">
        
        {/* Left: Floating Logo Container */}
        <div className="flex-1 flex justify-start pointer-events-auto">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveLink("Home");
            }}
            className="flex items-center bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-[rgba(214,185,140,0.25)] shadow-[0_4px_20px_rgba(91,70,54,0.06)] hover:border-[rgba(214,185,140,0.4)] hover:shadow-[0_6px_24px_rgba(91,70,54,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <img
              src={logo}
              alt="Winway Logo"
              style={{
                height: "40px",
                width: "auto",
                filter: "drop-shadow(0 1px 4px rgba(91,70,54,0.08))",
              }}
            />
          </Link>
        </div>

        {/* Center: Floating Pill Navigation Container */}
        <div className="hidden md:flex flex-shrink-0 justify-center pointer-events-auto">
          <div 
            className="flex items-center space-x-8 px-8 py-[21px] bg-white/95 backdrop-blur-md rounded-full border border-[rgba(214,185,140,0.25)] shadow-[0_4px_20px_rgba(91,70,54,0.06)]"
          >
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveLink(link.name)}
                  className="relative transition-colors duration-300 text-sm font-semibold hover:text-[#5B4636] py-1"
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
                  className="relative transition-colors duration-300 text-sm font-semibold hover:text-[#5B4636] py-1"
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
        </div>

        {/* Right: Floating CTA and Mobile Hamburger */}
        <div className="flex-1 flex justify-end items-center gap-3 pointer-events-auto">
          {/* Desktop CTA */}
          <MagneticButton className="hidden md:inline-flex">
            <a
              href="#contact"
              className="inline-flex items-center rounded-full px-7 py-[22px] text-xs font-bold uppercase tracking-widest text-[#5B4636] hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
                boxShadow: "0 4px 14px rgba(184,147,106,0.3)",
                border: "1px solid rgba(214, 185, 140, 0.25)",
              }}
            >
              Contact Now
            </a>
          </MagneticButton>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-[21px] rounded-full bg-white/95 backdrop-blur-md border border-[rgba(214,185,140,0.25)] shadow-[0_4px_20px_rgba(91,70,54,0.06)] hover:bg-[#F3E9DC]/30 active:scale-95 transition-all flex items-center justify-center"
            style={{ color: "#5B4636" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Floating Mobile Dropdown Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            opacity: 1,
            height: "auto",
            pointerEvents: "auto",
            transition: { duration: 0.25, ease: "easeOut" }
          },
          closed: {
            opacity: 0,
            height: 0,
            pointerEvents: "none",
            transition: { duration: 0.2, ease: "easeIn" }
          }
        }}
        className="md:hidden mt-3 mx-auto w-full rounded-3xl bg-white/95 backdrop-blur-md border border-[rgba(214,185,140,0.25)] shadow-[0_10px_30px_rgba(91,70,54,0.1)] overflow-hidden"
      >
        <div className="py-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.name, link.href)}
              className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors duration-200 text-left"
              style={{
                color: activeLink === link.name ? "#5B4636" : "#7a6153",
                borderBottom: "1px solid rgba(214,185,140,0.1)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              {link.name}
              {activeLink === link.name && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#D6B98C" }} />
              )}
            </button>
          ))}
          <div className="px-5 pt-3 pb-5">
            <button
              onClick={() => handleNavClick("Contact", "#contact")}
              className="flex items-center justify-center w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-widest text-[#5B4636] active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
                boxShadow: "0 2px 12px rgba(184,147,106,0.3)",
                cursor: "pointer",
              }}
            >
              Contact Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}