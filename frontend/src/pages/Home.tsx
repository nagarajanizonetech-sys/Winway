import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import BrandMarquee from "../components/BrandMarquee";
import ProductCard from "../components/ProductCard";
import EnquiryModal from "../components/EnquiryModal";
import ProductDetailsModal from "../components/ProductDetailsModal";
import ServicesSection from "../components/ServicesSection";
import WhyUsSection from "../components/WhyUsSection";
import { Laptop, Search, X } from "lucide-react";
import api from "../services/api";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enquiryContext, setEnquiryContext] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filterChips = [
    { label: "All", value: "" },
    { label: "AMD", value: "amd" },
    { label: "Intel", value: "intel" },
  ];

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      product.name?.toLowerCase().includes(query) ||
      product.processor?.toLowerCase().includes(query) ||
      product.ram?.toLowerCase().includes(query) ||
      product.storage?.toLowerCase().includes(query) ||
      product.graphics?.toLowerCase().includes(query) ||
      product.display?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleEnquire = (titleOrProduct: string | any) => {
    if (typeof titleOrProduct === "string") {
      setEnquiryContext(titleOrProduct);
    } else {
      setEnquiryContext(titleOrProduct.name);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#5B4636]">
      <HeroSection onEnquire={handleEnquire} />
      <BrandMarquee />
      <ServicesSection onEnquire={handleEnquire} />
      <WhyUsSection />

      {/* Products Section */}
      <section
        id="products"
        className="py-20 md:py-32 bg-[#F3E9DC] relative overflow-hidden"
      >
        {/* Subtle top divider */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D6B98C]/50 to-transparent" />

        {/* Decorative background blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#D6B98C]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-[#D6B98C]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-16">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#D6B98C] font-semibold">
                  Featured Products
                </p>
                <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-[#5B4636] tracking-tight leading-tight">
                  Top laptops{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #D6B98C 0%, #b8936a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    ready to deploy.
                  </span>
                </h2>
              </div>
              <p className="max-w-xl text-lg text-[#7a6153] leading-relaxed">
                Explore our curated collection of premium devices and accessories,
                built for gaming, content creation, and professional workflows.
              </p>
            </div>
          </motion.div>

          {/* Search and Filters Block */}
          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Premium Glassmorphic Search Input */}
              <div className="relative flex-1 max-w-md w-full group">
                <input
                  type="text"
                  placeholder="Search by brand, cpu, gpu, ram..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-11 py-3.5 bg-white/70 backdrop-blur-md rounded-2xl border border-[rgba(214,185,140,0.3)] text-[#5B4636] placeholder-[#7a6153]/50 focus:outline-none focus:ring-2 focus:ring-[#D6B98C] focus:border-transparent transition-all duration-300 shadow-sm text-sm"
                />
                <div className="absolute inset-y-1.5 left-1.5 w-9 h-9 rounded-xl bg-gradient-to-r from-[#D6B98C] to-[#b8936a] flex items-center justify-center pointer-events-none shadow-sm text-[#5B4636] z-10">
                  <Search size={15} className="stroke-[3]" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-4 flex items-center text-[#7a6153]/60 hover:text-[#5B4636] transition-colors z-10"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Specs Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {filterChips.map((chip) => {
                  const isActive =
                    (chip.value === "" && searchQuery === "") ||
                    (chip.value !== "" && searchQuery.toLowerCase() === chip.value.toLowerCase());
                  return (
                    <button
                      key={chip.label}
                      onClick={() => setSearchQuery(chip.value)}
                      className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                        isActive
                          ? "bg-[#D6B98C] text-[#5B4636] border-[#D6B98C] shadow-sm scale-105"
                          : "bg-white/50 text-[#7a6153] border-[rgba(214,185,140,0.3)] hover:bg-[#F3E9DC]/60 hover:border-[#D6B98C]/50 hover:text-[#5B4636]"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Products Grid or Empty State */}
          {products.length === 0 ? (
            <div
              className="rounded-3xl p-20 text-center relative overflow-hidden"
              style={{
                background: "rgba(255, 253, 247, 0.7)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(214, 185, 140, 0.3)",
                boxShadow: "0 8px 40px rgba(91, 70, 54, 0.06)",
              }}
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D6B98C]/10 blur-[80px] rounded-full pointer-events-none" />
              <div
                className="mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(214, 185, 140, 0.15)" }}
              >
                <Laptop className="h-10 w-10 text-[#D6B98C]" />
              </div>
              <h3 className="text-2xl font-bold text-[#5B4636] mb-3">
                No products available yet
              </h3>
              <p className="text-[#7a6153] max-w-md mx-auto text-base leading-relaxed">
                Products added through the admin panel will appear in this
                section. Check back soon!
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* No search results empty state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl p-16 text-center relative overflow-hidden max-w-2xl mx-auto"
              style={{
                background: "rgba(255, 253, 247, 0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(214, 185, 140, 0.2)",
                boxShadow: "0 8px 30px rgba(91, 70, 54, 0.04)",
              }}
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D6B98C]/5 blur-[80px] rounded-full pointer-events-none" />
              <div
                className="mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center text-[#7a6153]/50"
                style={{ background: "rgba(214, 185, 140, 0.1)" }}
              >
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#5B4636] mb-2">
                No matching products found
              </h3>
              <p className="text-[#7a6153]/80 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                We couldn't find any products matching "{searchQuery}". Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2.5 rounded-full bg-[#D6B98C] text-[#5B4636] text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm border border-[rgba(214,185,140,0.3)]"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEnquire={handleEnquire}
                  onClick={(prod) => {
                    setSelectedProduct(prod);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contextTitle={enquiryContext}
      />

      <ProductDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
        onEnquire={handleEnquire}
      />
    </div>
  );
}