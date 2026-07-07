import React, { useState, useEffect } from "react";
import { X, Camera, Sparkles, Link } from "lucide-react";
import api from "../services/api";

interface HeroData {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  image_position: string;
  is_active: boolean;
  tag?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  display?: string;
  graphics?: string;
}

interface Product {
  id: number;
  name: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  price: number | null;
  image_url: string | null;
}

interface HeroSectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  editingSlide: HeroData | null;
}

export default function HeroSectionForm({
  isOpen,
  onClose,
  onSubmitSuccess,
  editingSlide,
}: HeroSectionFormProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [tag, setTag] = useState("Special Offer");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [display, setDisplay] = useState("");
  const [graphics, setGraphics] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Products array for quick-linking selector
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Fetch available products to link to
      const fetchProducts = async () => {
        try {
          const res = await api.get("/products/");
          setProducts(res.data || []);
        } catch (err) {
          console.error("Failed to load products list for linking dropdown", err);
        }
      };
      fetchProducts();

      if (editingSlide) {
        setTitle(editingSlide.title);
        setSubtitle(editingSlide.subtitle);
        setButtonText(editingSlide.button_text);
        setButtonLink(editingSlide.button_link);
        setTag(editingSlide.tag || "Special Offer");
        setProcessor(editingSlide.processor || "");
        setRam(editingSlide.ram || "");
        setStorage(editingSlide.storage || "");
        setDisplay(editingSlide.display || "");
        setGraphics(editingSlide.graphics || "");
        setIsActive(editingSlide.is_active);
        setImagePreview(editingSlide.image_url);
        setImageFile(null);
        setSelectedProductId("");
      } else {
        setTitle("");
        setSubtitle("");
        setButtonText("Browse Products");
        setButtonLink("#products");
        setTag("Special Offer");
        setProcessor("");
        setRam("");
        setStorage("");
        setDisplay("");
        setGraphics("");
        setIsActive(true);
        setImagePreview(null);
        setImageFile(null);
        setSelectedProductId("");
      }
    }
  }, [isOpen, editingSlide]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // When admin selects a product, populate the button link and text fields automatically!
  const handleProductSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedProductId(pId);
    if (!pId) return;

    const matchedProduct = products.find((p) => String(p.id) === pId);
    if (matchedProduct) {
      setButtonLink(`#product-${matchedProduct.id}`);
      setButtonText(`Enquire ${matchedProduct.name}`);
      
      // Auto fill title if it's empty to make admin life even easier!
      if (!title) {
        setTitle(`${matchedProduct.name}\nAvailable Now at Winway`);
      }
      if (!subtitle) {
        setSubtitle(
          `${matchedProduct.processor} / ${matchedProduct.ram} RAM / ${matchedProduct.storage} Storage / ${matchedProduct.graphics || "Intel Graphics"}. High-performance laptop ready to deploy.`
        );
      }

      // Auto-populate spec fields matching product specs
      setTag("Special Offer");
      setProcessor(matchedProduct.processor || "");
      setRam(matchedProduct.ram || "");
      setStorage(matchedProduct.storage || "");
      setDisplay(matchedProduct.display || "");
      setGraphics(matchedProduct.graphics || "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !buttonText || !buttonLink) {
      alert("All text fields are required.");
      return;
    }

    if (!editingSlide && !imageFile) {
      alert("Please upload a hero banner image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("button_text", buttonText);
    formData.append("button_link", buttonLink);
    formData.append("tag", tag);
    formData.append("processor", processor);
    formData.append("ram", ram);
    formData.append("storage", storage);
    formData.append("display", display);
    formData.append("graphics", graphics);
    formData.append("is_active", String(isActive));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (editingSlide) {
        await api.put(`/admin/hero-section/${editingSlide.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/admin/hero-section", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save hero slide", err);
      alert("Failed to save hero slide. Please verify you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ↓ Background overlay: opacity raised to /90, blur upgraded to 3xl
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-[#35251A]/90 backdrop-blur-3xl">
      <div className="absolute inset-0" onClick={onClose} />

      {/* ↓ Modal height: max-h raised to 99vh, inner padding increased to p-10 */}
      <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-gradient-to-b from-[#FFFDF7]/95 to-[#F3E9DC]/98 p-10 shadow-2xl overflow-y-auto max-h-[99vh]">
        {/* Glow ambient */}
        <div className="absolute -left-10 -top-10 -z-10 h-32 w-32 rounded-full bg-[#D6B98C]/15 blur-[60px]" />
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-[rgba(214,185,140,0.25)] bg-[#FFFDF7]/60 p-2 text-[#5B4636] transition hover:bg-[#F3E9DC]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D6B98C]/15 text-[#D6B98C] border border-[#D6B98C]/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-black text-[#5B4636] uppercase tracking-wider">
            {editingSlide ? "Edit Hero Slide" : "Create Hero Slide"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* QUICK LINK TO PRODUCT SELECTOR */}
          <div className="rounded-2xl border border-[#D6B98C]/25 bg-[#D6B98C]/[0.06] p-4 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#D6B98C]">
              <Link className="h-3.5 w-3.5" />
              Easy Locate: Quick-Link to a Laptop Product
            </label>
            <p className="text-[10px] text-[#7a6153] leading-normal">
              Selecting an uploaded laptop product automatically populates the button action links and slide text fields for you!
            </p>
            <select
              value={selectedProductId}
              onChange={handleProductSelectChange}
              className="w-full mt-1.5 rounded-xl border border-[rgba(214,185,140,0.3)] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
            >
              <option value="">-- Optional: Choose a product to link --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.processor} | {p.ram})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
              Title / Main Headline (Supports \n for wrapping)
            </label>
            <textarea
              required
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-[rgba(214,185,140,0.3)] bg-white px-4 py-3 text-xs font-medium text-[#5B4636] placeholder-[#7a6153]/50 focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              placeholder="e.g. 13-Inch Big-Screen Experience\nNow at the Lowest Price"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
              Subtitle / Descriptive Text
            </label>
            <textarea
              required
              rows={3}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-2xl border border-[rgba(214,185,140,0.3)] bg-white px-4 py-3 text-xs font-medium text-[#5B4636] placeholder-[#7a6153]/50 focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              placeholder="e.g. Experience unmatched portability combined with top-tier hardware configurations."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                required
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                Button Link / Anchor
              </label>
              <input
                type="text"
                required
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              />
            </div>
          </div>

          {/* Tag & Specs Section */}
          <div className="border-t border-[rgba(214,185,140,0.2)] pt-4 space-y-4">
            <h3 className="text-xs font-black text-[#5B4636] uppercase tracking-wider">
              Slide Tags & Specifications (Optional)
            </h3>
            
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                Slide Tag / Badge Text
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Special Offer, Best Seller, Gaming Pick"
                className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                  Processor / CPU
                </label>
                <input
                  type="text"
                  value={processor}
                  onChange={(e) => setProcessor(e.target.value)}
                  placeholder="e.g. Intel Core i9"
                  className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                  RAM
                </label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g. 16GB DDR5"
                  className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                  Storage / SSD
                </label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="e.g. 1TB SSD"
                  className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                  Graphics / GPU
                </label>
                <input
                  type="text"
                  value={graphics}
                  onChange={(e) => setGraphics(e.target.value)}
                  placeholder="e.g. NVIDIA RTX 4070"
                  className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
                Display Size
              </label>
              <input
                type="text"
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder="e.g. 15.6 inch FHD"
                className="w-full rounded-full border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-xs font-medium text-[#5B4636] focus:border-[#D6B98C] focus:outline-none focus:ring-1 focus:ring-[#D6B98C]"
              />
            </div>
          </div>

          {/* Active Status toggle switch */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF7] border border-[rgba(214,185,140,0.2)]">
            <div>
              <p className="text-xs font-bold text-[#5B4636] leading-none">Set Active Slide</p>
              <p className="text-[10px] text-[#7a6153] mt-1">If true, this slide will be displayed on the landing page.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                isActive ? "bg-[#D6B98C]" : "bg-[#F3E9DC]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Single Image Upload Box */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#7a6153] mb-1.5">
              Hero Banner Image {editingSlide && "(Leave blank to keep current image)"}
            </label>
            {/* ↓ Image upload area height increased to p-10 */}
            <div className="rounded-3xl border border-dashed border-[rgba(214,185,140,0.3)] p-10 text-center bg-[#FFFDF7]/85 relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative">
                  {/* ↓ Preview image max height increased to 220px */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[220px] mx-auto rounded-2xl object-contain border border-[rgba(214,185,140,0.2)]"
                  />
                  <div className="absolute inset-0 bg-[#35251A]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <label className="cursor-pointer bg-[#D6B98C] text-[#5B4636] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#b8936a] transition">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E9DC] text-[#D6B98C]">
                    <Camera className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-[#7a6153]">Click to upload a banner image</p>
                  <p className="text-[9px] text-[#7a6153]/70 mt-1">Wide image maps to Right aligned, Portrait to Center, Square to Left</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 rounded-full border border-[rgba(214,185,140,0.3)] bg-[#FFFDF7] py-3 text-xs font-bold text-[#5B4636] hover:bg-[#F3E9DC] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[1.5] rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] py-3 text-xs font-bold text-[#5B4636] shadow-lg transition hover:shadow-[#D6B98C]/20 hover:scale-[1.02] disabled:opacity-50 border border-[rgba(214,185,140,0.3)]"
            >
              {loading ? "Saving..." : editingSlide ? "Update Slide" : "Create Slide"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}