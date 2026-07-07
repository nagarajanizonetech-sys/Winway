import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Phone, Sparkles, Mail, User, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTitle?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  contextTitle,
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (contextTitle) {
        setProductName(contextTitle);
        setMessage(`I am interested in: ${contextTitle}\n\nPlease provide more information regarding specifications, stock status, and final discount pricing.`);
      } else {
        setProductName("");
        setMessage("");
      }
      setName("");
      setEmail("");
      setPhone("");
      setFormErrors({});
      setStatus("idle");
    }
  }, [isOpen, contextTitle]);

  const triggerToast = (type: "success" | "error", msg: string) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4500);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Full name is required";
    if (!email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Please enter a valid email address";
    if (!phone.trim()) errors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{10,15}$/.test(phone.trim())) errors.phone = "Invalid phone number (minimum 10 digits required)";
    if (!productName.trim()) errors.productName = "Product name is required";
    if (!message.trim()) errors.message = "Message details are required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      triggerToast("error", "Validation failed. Please correct highlighted fields.");
      return;
    }
    setStatus("submitting");
    try {
      await api.post("/enquiries/", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        product_name: productName.trim(),
        message: message.trim(),
      });
      setStatus("success");
      triggerToast("success", "Enquiry sent! We'll be in touch shortly.");
      setName(""); setEmail(""); setPhone(""); setProductName(""); setMessage("");
      setTimeout(() => { onClose(); setStatus("idle"); }, 3200);
    } catch (error) {
      console.error("Submission error", error);
      setStatus("error");
      triggerToast("error", "Connection error. Failed to send enquiry.");
    }
  };

  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
  };

  // Shared input class builder
  const inputClass = (field: string) =>
    `w-full rounded-2xl border px-4 py-3.5 text-sm text-[#5B4636] outline-none transition-all duration-300 placeholder-[#c4a882] bg-white/70 hover:bg-white hover:border-[#D6B98C] focus:bg-white focus:ring-2 ${
      formErrors[field]
        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
        : "border-[rgba(214,185,140,0.4)] focus:border-[#D6B98C] focus:ring-[rgba(214,185,140,0.25)]"
    }`;

  const labelClass = (field: string) =>
    `transition-colors duration-300 ${focusedField === field ? "text-[#b8936a] font-bold" : "text-[#a8896e]"}`;

  const iconClass = (field: string) =>
    `transition-all duration-300 ${focusedField === field ? "text-[#D6B98C] translate-x-0.5 scale-110" : "text-[#c4a882]"}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -60, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className={`fixed top-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3.5 rounded-2xl px-6 py-4 shadow-xl border ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              {toast.type === "success" ? (
                <div className="rounded-full bg-emerald-100 p-1.5">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="rounded-full bg-rose-100 p-1.5">
                  <svg className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.87 1.5h18.62a1 1 0 00.87-1.5L13.73 3.86a2 2 0 00-3.44 0z" />
                  </svg>
                </div>
              )}
              <span className="text-xs font-bold tracking-wide">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-md"
          style={{ background: "rgba(91, 70, 54, 0.45)" }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 35, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-3xl overflow-hidden"
          style={{
            borderRadius: "2.5rem",
            background: "linear-gradient(145deg, #FFFDF7 0%, #F3E9DC 100%)",
            border: "1px solid rgba(214,185,140,0.4)",
            boxShadow: "0 25px 70px -10px rgba(91,70,54,0.25), 0 0 0 1px rgba(255,253,247,0.8) inset",
            padding: "2.5rem",
          }}
        >
          {/* Ambient warm glows */}
          <div className="absolute -left-20 -top-20 -z-10 h-48 w-48 rounded-full pointer-events-none"
            style={{ background: "rgba(214,185,140,0.2)", filter: "blur(80px)" }} />
          <div className="absolute -right-20 -bottom-20 -z-10 h-48 w-48 rounded-full pointer-events-none"
            style={{ background: "rgba(214,185,140,0.15)", filter: "blur(80px)" }} />

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-6 top-6 z-30 rounded-full p-2.5 transition-all duration-300"
            style={{
              background: "rgba(214,185,140,0.15)",
              border: "1px solid rgba(214,185,140,0.3)",
              color: "#7a6153",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(214,185,140,0.3)";
              (e.currentTarget as HTMLButtonElement).style.color = "#5B4636";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(214,185,140,0.15)";
              (e.currentTarget as HTMLButtonElement).style.color = "#7a6153";
            }}
          >
            <X className="h-4 w-4" />
          </motion.button>

          {/* Header */}
          <div className="mb-8 rounded-2xl p-5 relative"
            style={{
              background: "rgba(255,253,247,0.6)",
              border: "1px solid rgba(214,185,140,0.25)",
              backdropFilter: "blur(8px)",
            }}>
            <div className="flex items-center gap-2 mb-2" style={{ color: "#D6B98C" }}>
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Laptop Enquiry</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: "#5B4636" }}>
              Request pricing or custom specs.
            </h2>
            <p className="mt-2 text-xs font-medium" style={{ color: "#a8896e" }}>
              Submit below and we'll send a detailed proposal straight to your inbox.
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full"
                style={{
                  background: "rgba(214,185,140,0.15)",
                  border: "1.5px solid rgba(214,185,140,0.4)",
                  color: "#b8936a",
                }}>
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-black tracking-tight" style={{ color: "#5B4636" }}>
                Enquiry Sent!
              </h3>
              <p className="mt-4 text-sm max-w-md leading-relaxed font-medium" style={{ color: "#7a6153" }}>
                Your request has been received. A copy has been saved and our team will be in touch shortly.
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-full px-4 py-1.5"
                style={{ background: "rgba(214,185,140,0.15)", border: "1px solid rgba(214,185,140,0.3)" }}>
                <span className="h-2 w-2 rounded-full animate-ping" style={{ background: "#D6B98C" }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#b8936a" }}>
                  Closing window automatically
                </span>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* Name */}
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                      <User size={12} className={iconClass("name")} />
                      <span className={labelClass("name")}>Customer Name</span>
                    </label>
                    <input type="text" value={name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => { setName(e.target.value); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }}
                      className={inputClass("name")}
                      placeholder="e.g. John Doe"
                    />
                    {formErrors.name && <span className="mt-1.5 block text-[10px] text-rose-500 font-bold">{formErrors.name}</span>}
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                      <Mail size={12} className={iconClass("email")} />
                      <span className={labelClass("email")}>Email Address</span>
                    </label>
                    <input type="email" value={email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => { setEmail(e.target.value); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }}
                      className={inputClass("email")}
                      placeholder="e.g. john@gmail.com"
                    />
                    {formErrors.email && <span className="mt-1.5 block text-[10px] text-rose-500 font-bold">{formErrors.email}</span>}
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                      <Phone size={12} className={iconClass("phone")} />
                      <span className={labelClass("phone")}>Phone Number</span>
                    </label>
                    <input type="tel" value={phone}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => { setPhone(e.target.value); if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" }); }}
                      className={inputClass("phone")}
                      placeholder="e.g. +91 9876543210"
                    />
                    {formErrors.phone && <span className="mt-1.5 block text-[10px] text-rose-500 font-bold">{formErrors.phone}</span>}
                  </motion.div>

                  {/* Product */}
                  <motion.div variants={itemVariants} className="relative">
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                      <Laptop size={12} className={iconClass("productName")} />
                      <span className={labelClass("productName")}>Product Interested In</span>
                    </label>
                    <input type="text" value={productName}
                      onFocus={() => setFocusedField("productName")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => { setProductName(e.target.value); if (formErrors.productName) setFormErrors({ ...formErrors, productName: "" }); }}
                      className={inputClass("productName")}
                      placeholder="Product model or service"
                    />
                    {formErrors.productName && <span className="mt-1.5 block text-[10px] text-rose-500 font-bold">{formErrors.productName}</span>}
                  </motion.div>
                </div>

                {/* Message */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                    <Cpu size={12} className={iconClass("message")} />
                    <span className={labelClass("message")}>Message / Requirements</span>
                  </label>
                  <textarea rows={4} value={message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => { setMessage(e.target.value); if (formErrors.message) setFormErrors({ ...formErrors, message: "" }); }}
                    className={`${inputClass("message")} resize-none`}
                    placeholder="Describe specific modifications or custom requirements..."
                  />
                  {formErrors.message && <span className="mt-1.5 block text-[10px] text-rose-500 font-bold">{formErrors.message}</span>}
                </motion.div>

                {/* Error alert */}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl p-4 text-xs font-bold flex items-center gap-3"
                    style={{
                      background: "rgba(255,241,241,0.8)",
                      border: "1px solid rgba(244,63,94,0.2)",
                      color: "#c0392b",
                    }}
                  >
                    <svg className="h-4 w-4 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a1 1 0 00.87 1.5h18.62a1 1 0 00.87-1.5L13.73 3.86a2 2 0 00-3.44 0z" />
                    </svg>
                    <span>System communication issue. Please verify your network and submit again.</span>
                  </motion.div>
                )}

                {/* Submit button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.015, boxShadow: "0 8px 32px rgba(184,147,106,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full flex items-center justify-center gap-2.5 rounded-full px-6 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
                      color: "#5B4636",
                      boxShadow: "0 4px 20px rgba(184,147,106,0.25)",
                    }}
                  >
                    {status === "submitting" ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Sending enquiry...</span>
                      </>
                    ) : (
                      <span>Send Enquiry</span>
                    )}
                  </motion.button>
                </motion.div>

              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}