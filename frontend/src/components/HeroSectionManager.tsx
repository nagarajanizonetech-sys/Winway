import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, AlertCircle } from "lucide-react";
import api from "../services/api";
import HeroSectionForm from "./HeroSectionForm";
import HeroSectionPreview from "./HeroSectionPreview";

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

export default function HeroSectionManager() {
  const [slides, setSlides] = useState<HeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroData | null>(null);
  const [previewSlide, setPreviewSlide] = useState<HeroData | null>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hero-section/all");
      setSlides(res.data);
      
      // Auto-select the active slide for preview
      const active = res.data.find((s: HeroData) => s.is_active);
      if (active) {
        setPreviewSlide(active);
      } else if (res.data.length > 0) {
        setPreviewSlide(res.data[0]);
      } else {
        setPreviewSlide(null);
      }
    } catch (err) {
      console.error("Failed to fetch all hero slides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hero slide?")) return;

    const token = localStorage.getItem("adminToken");
    try {
      await api.delete(`/admin/hero-section/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSlides();
    } catch (err) {
      console.error("Failed to delete slide", err);
      alert("Failed to delete slide.");
    }
  };

  const handleEditClick = (slide: HeroData) => {
    setEditingSlide(slide);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingSlide(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* ── TOP SECTION: ACTION AND LIVE PREVIEW ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#5B4636] uppercase tracking-wider">
            Hero Banners Configuration
          </h2>
          <p className="text-xs text-[#7a6153] mt-1">
            Design, preview, and deploy high-conversion luxury hero banners for your landing page.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-5 py-2.5 text-xs font-bold text-[#5B4636] shadow-lg transition hover:shadow-[#D6B98C]/20 hover:scale-105 active:scale-95 border border-[rgba(214,185,140,0.3)]"
        >
          <Plus className="h-4 w-4" />
          Add Hero Slide
        </button>
      </div>

      {/* Live mockup layout preview */}
      {previewSlide && (
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7a6153] block mb-1">
            Storefront Live Mockup Preview
          </span>
          <HeroSectionPreview slide={previewSlide} />
        </div>
      )}

      {/* ── SLIDE LISTING ── */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D6B98C]">
          Configured Banners Inventory
        </h3>

        {loading && slides.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#7a6153] bg-[#FFFDF7]/50 border border-[rgba(214,185,140,0.2)] rounded-3xl animate-pulse">
            Loading Hero Slides...
          </div>
        ) : slides.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-[rgba(214,185,140,0.3)] bg-[#FFFDF7]/50 p-6">
            <AlertCircle className="h-8 w-8 text-[#7a6153] mx-auto mb-2.5" />
            <p className="text-sm font-bold text-[#5B4636]">No Banners Found</p>
            <p className="text-xs text-[#7a6153] mt-1">Click "Add Hero Slide" above to deploy your first landing page slide.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`relative flex flex-col md:flex-row items-center gap-4 rounded-3xl border px-4 py-3 bg-[#FFFDF7]/50 transition duration-300 ${
                  slide.is_active
                    ? "border-[#D6B98C]/40 bg-gradient-to-r from-[#D6B98C]/[0.06] to-transparent"
                    : "border-[rgba(214,185,140,0.15)] hover:border-[rgba(214,185,140,0.3)]"
                }`}
              >
                {/* Thumbnail */}
                <div className="h-14 w-20 shrink-0 rounded-2xl bg-[#F3E9DC]/50 border border-[rgba(214,185,140,0.2)] overflow-hidden flex items-center justify-center p-1.5">
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="h-full w-auto object-contain rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2.5 mb-1">
                    <h4 className="text-xs font-black text-[#5B4636] truncate uppercase tracking-wide">
                      {slide.title.replace("\\n", " ")}
                    </h4>
                    {slide.is_active && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#D6B98C]/15 border border-[#D6B98C]/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-[#5B4636]">
                        Active Banners
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7a6153] truncate max-w-xl">
                    {slide.subtitle}
                  </p>
                </div>

                {/* Action Items */}
                <div className="flex items-center gap-2 shrink-0 z-10">
                  <button
                    onClick={() => setPreviewSlide(slide)}
                    title="Load Preview"
                    className="rounded-full border border-[rgba(214,185,140,0.2)] bg-[#FFFDF7]/60 p-2.5 text-[#7a6153] hover:bg-[#F3E9DC] hover:text-[#5B4636] transition"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleEditClick(slide)}
                    title="Edit Slide"
                    className="rounded-full border border-[rgba(214,185,140,0.2)] bg-[#FFFDF7]/60 p-2.5 text-[#D6B98C] hover:bg-[#D6B98C]/10 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    title="Delete Slide"
                    className="rounded-full border border-red-500/10 bg-red-500/5 p-2.5 text-red-700 hover:bg-red-500/15 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <HeroSectionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmitSuccess={fetchSlides}
        editingSlide={editingSlide}
      />
    </div>
  );
}
