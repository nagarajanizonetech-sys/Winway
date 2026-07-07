import { Mail, MapPin, Phone } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import logo from "../assets/winway1.png";

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 10 : 60
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 5 : 60
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.footer
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="bg-[#35251A] text-[#FFFDF7]/85 pt-20 pb-10 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.08),transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#FFFDF7]/15 bg-[#35251A] p-6 md:p-10 shadow-sm shadow-black/20 grid gap-10 lg:grid-cols-3">
          {/* Logo and description */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-4 mb-4">
              <img src={logo} alt="Winway Logo" className="h-14 w-48 object-contain" />
            </div>
            <p className="text-sm text-[#FFFDF7]/70 max-w-sm">
              Your trusted partner for premium laptops, expert repairs, and
              tailored IT solutions delivered with speed and confidence.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#D6B98C] text-xs font-black uppercase tracking-widest mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-[#FFFDF7]/80">
              <li>
                <a href="#" className="hover:text-[#D6B98C] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D6B98C] transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D6B98C] transition">
                  Products
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D6B98C] transition">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants}>
            <h4 className="text-[#D6B98C] text-xs font-black uppercase tracking-widest mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-[#FFFDF7]/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#D6B98C] shrink-0" />
                <span>
                  Winway computers 
                  Shop no.1, premier towers,
                  Karur by pass road,
                  Opp to yamaha show room,
                  Chattiram bus stand,

                  <br />
                  Trichy - 620002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#D6B98C] shrink-0" />
                <span>9786508080</span> 
                <span>9894575152</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#D6B98C] shrink-0" />
                <span>support@winway.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright section */}
        <motion.div
          variants={itemVariants}
          className="mt-10 border-t border-[#FFFDF7]/10 pt-6 text-center text-sm text-[#FFFDF7]/60"
        >
          &copy; {new Date().getFullYear()} Winway Computers. All rights
          reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
}
