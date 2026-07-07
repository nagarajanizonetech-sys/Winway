import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, LogOut, Camera, X, Cpu, MemoryStick,
  HardDrive, Monitor, Gpu, Edit, Layout, Package
} from "lucide-react";
import api from "../services/api";
import logo from "../logo.png";
import HeroSectionManager from "../components/HeroSectionManager";

type Tab = "products" | "hero";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [display, setDisplay] = useState("");
  const [graphics, setGraphics] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const resetForm = () => {
    setName("");
    setProcessor("");
    setRam("");
    setStorage("");
    setDisplay("");
    setGraphics("");
    setPrice("");
    setImages([]);
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleStartEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setProcessor(product.processor);
    setRam(product.ram);
    setStorage(product.storage);
    setDisplay(product.display);
    setGraphics(product.graphics);
    setPrice(product.price ? String(product.price) : "");
    setImages([]);
    setIsAdding(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("processor", processor);
      formData.append("ram", ram);
      formData.append("storage", storage);
      formData.append("display", display);
      formData.append("graphics", graphics);
      if (price) formData.append("price", price);

      if (images && images.length > 0) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/admin/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setIsAdding(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const specFields = [
    { icon: <Cpu className="h-4 w-4" />, label: "Processor (CPU)", value: processor, setter: setProcessor, placeholder: "Intel i5 / Ryzen 7", key: "processor" },
    { icon: <MemoryStick className="h-4 w-4" />, label: "RAM", value: ram, setter: setRam, placeholder: "8GB / 16GB", key: "ram" },
    { icon: <HardDrive className="h-4 w-4" />, label: "Storage", value: storage, setter: setStorage, placeholder: "512GB SSD", key: "storage" },
    { icon: <Monitor className="h-4 w-4" />, label: "Display", value: display, setter: setDisplay, placeholder: '15.6" FHD', key: "display" },
    { icon: <Gpu className="h-4 w-4" />, label: "Graphics (GPU)", value: graphics, setter: setGraphics, placeholder: "Integrated / RTX 3050", key: "graphics" },
  ];

  const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
    { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
    { id: "hero", label: "Hero Banners", icon: <Layout className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#5B4636] pb-12 pt-28">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(214,185,140,0.15),transparent_22%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div className="rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-[#F3E9DC] p-6 md:p-8 shadow-sm mb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              <img src={logo} alt="Winway Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain shrink-0" />
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-[#5B4636]">Admin Dashboard</h1>
                <p className="mt-1 md:mt-2 text-sm md:text-base text-[#7a6153]">
                  Manage inventory, hero banners, and keep your storefront polished.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {activeTab === "products" && (
                <button
                  onClick={() => { resetForm(); setIsAdding(true); }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-5 py-3 text-sm font-semibold text-[#5B4636] shadow-lg transition hover:shadow-xl hover:scale-105 active:scale-95 border border-[rgba(214,185,140,0.3)]"
                >
                  <Plus className="h-4 w-4" /> Add Product
                </button>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(214,185,140,0.3)] bg-[#FFFDF7] px-5 py-3 text-sm font-semibold text-[#5B4636] transition hover:bg-[#F3E9DC] active:scale-95"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── TAB NAVIGATION ── */}
        <div className="flex gap-1.5 mb-6 bg-[#F3E9DC] rounded-2xl border border-[rgba(214,185,140,0.25)] p-1.5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#D6B98C] text-[#5B4636] shadow-md"
                  : "text-[#7a6153] hover:text-[#5B4636] hover:bg-[#FFFDF7]/60"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ADD/EDIT PRODUCT MODAL ── */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#35251A]/60 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[rgba(214,185,140,0.35)] bg-gradient-to-b from-[#FFFDF7] to-[#F3E9DC] p-8 shadow-2xl">
              <button
                onClick={resetForm}
                className="absolute right-6 top-6 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(214,185,140,0.25)] bg-[#FFFDF7]/60 text-[#5B4636] transition hover:bg-[#F3E9DC]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 rounded-3xl border border-[rgba(214,185,140,0.2)] bg-[#FFFDF7]/85 p-6 text-[#5B4636]">
                <p className="text-sm uppercase tracking-[0.25em] text-[#7a6153]">
                  {editingProduct ? "Modify Details" : "New product"}
                </p>
                <h2 className="mt-3 text-2xl font-bold">
                  {editingProduct ? `Edit specifications for ${editingProduct.name}` : "Add a premium item to your catalog"}
                </h2>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B4636] mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-3xl border border-[rgba(214,185,140,0.3)] bg-white px-4 py-3 text-[#5B4636] outline-none transition focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/20"
                    placeholder="Dell XPS 15"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B4636] mb-2">Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-3xl border border-[rgba(214,185,140,0.3)] bg-white px-4 py-3 text-[#5B4636] outline-none transition focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/20"
                    placeholder="e.g. 75000"
                  />
                </div>

                {/* Spec Fields */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B4636] mb-3">Specifications</label>
                  <div className="space-y-3">
                    {specFields.map(({ icon, label, value, setter, placeholder, key }) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFFDF7] text-[#D6B98C] border border-[rgba(214,185,140,0.25)]">
                          {icon}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="w-full rounded-2xl border border-[rgba(214,185,140,0.3)] bg-white px-4 py-2.5 text-sm text-[#5B4636] outline-none transition focus:border-[#D6B98C] focus:ring-2 focus:ring-[#D6B98C]/20"
                            placeholder={`${label} — e.g. ${placeholder}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-[#5B4636] mb-2">
                    Product Images (Up to 5) {editingProduct && "(Leave empty to keep current images)"}
                  </label>
                  <div className="rounded-3xl border border-dashed border-[rgba(214,185,140,0.3)] px-5 py-6 text-center bg-[#FFFDF7]/85">
                    <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E9DC] text-[#D6B98C]">
                      <Camera className="h-5 w-5" />
                    </div>
                    <p className="text-xs text-[#7a6153]">Upload up to 5 images to represent this item.</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-3 w-full text-xs text-[#7a6153] file:mr-4 file:rounded-full file:border-0 file:bg-[#D6B98C] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#5B4636] hover:file:bg-[#b8936a]"
                      onChange={(e) => {
                        if (e.target.files) {
                          const selectedFiles = Array.from(e.target.files);
                          if (selectedFiles.length > 5) {
                            alert("You can upload a maximum of 5 images.");
                            setImages(selectedFiles.slice(0, 5));
                          } else {
                            setImages(selectedFiles);
                          }
                        }
                      }}
                    />
                    {images.length > 0 && (
                      <div className="mt-3 text-left space-y-1 bg-[#F3E9DC]/40 border border-[rgba(214,185,140,0.2)] rounded-2xl p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#D6B98C]">
                          Selected files ({images.length}):
                        </p>
                        {images.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-[#5B4636]">
                            <span className="truncate max-w-[80%]">{idx + 1}. {file.name}</span>
                            <button
                              type="button"
                              onClick={() => setImages(images.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-400 text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-gradient-to-r from-[#D6B98C] to-[#b8936a] px-6 py-3 text-sm font-semibold text-[#5B4636] shadow-lg transition hover:shadow-xl disabled:opacity-60 border border-[rgba(214,185,140,0.3)]"
                >
                  {loading ? "Saving..." : (editingProduct ? "Save Changes" : "Add Product")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT ── */}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-[#F3E9DC]/30 p-6 shadow-sm">

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-[rgba(214,185,140,0.2)] text-left text-sm text-[#5B4636]">
                <thead className="border-b border-[rgba(214,185,140,0.25)] text-[#7a6153]">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em]">Product</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em]">Specs</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-[0.18em]">Price</th>
                    <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.18em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(214,185,140,0.15)]">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[#7a6153]">
                        No products found yet. Add your first item to begin.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-[#FFFDF7]/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#F3E9DC] border border-[rgba(214,185,140,0.2)] shrink-0">
                              {product.image_url ? (
                                <img
                                  src={product.image_url.split(",")[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-[#7a6153]">No img</div>
                              )}
                            </div>
                            <span className="font-semibold text-[#5B4636]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {[
                              { icon: <Cpu className="h-3 w-3" />, value: product.processor },
                              { icon: <MemoryStick className="h-3 w-3" />, value: product.ram },
                              { icon: <HardDrive className="h-3 w-3" />, value: product.storage },
                              { icon: <Monitor className="h-3 w-3" />, value: product.display },
                              { icon: <Gpu className="h-3 w-3" />, value: product.graphics },
                            ].map(({ icon, value }, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-[#7a6153]">
                                <span className="text-[#D6B98C]">{icon}</span>
                                {value || <span className="text-[#7a6153]/55">—</span>}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#5B4636]">
                          {product.price ? `₹${Number(product.price).toLocaleString("en-IN")}` : "On request"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#D6B98C]/35 bg-[#D6B98C]/10 px-4 py-2 text-sm font-semibold text-[#5B4636] transition hover:bg-[#D6B98C]/20"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/20"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {products.length === 0 ? (
                <div className="py-12 text-center text-[#7a6153]">No products found yet.</div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-[rgba(214,185,140,0.25)] bg-[#FFFDF7]/85 p-4 space-y-4 shadow-sm border border-[rgba(214,185,140,0.2)]">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-xl bg-[#F3E9DC] shrink-0 shadow-sm border border-[rgba(214,185,140,0.2)]">
                        {product.image_url ? (
                          <img src={product.image_url.split(",")[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-[#7a6153]">No img</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#5B4636]">{product.name}</h4>
                        <p className="text-sm font-semibold text-[#7a6153]">
                          {product.price ? `₹${Number(product.price).toLocaleString("en-IN")}` : "On request"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {[
                        { icon: <Cpu className="h-3 w-3" />, label: "CPU", value: product.processor },
                        { icon: <MemoryStick className="h-3 w-3" />, label: "RAM", value: product.ram },
                        { icon: <HardDrive className="h-3 w-3" />, value: product.storage },
                        { icon: <Monitor className="h-3 w-3" />, label: "Display", value: product.display },
                        { icon: <Gpu className="h-3 w-3" />, value: product.graphics },
                      ].map(({ icon, label, value }, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-[#F3E9DC]/40 px-2 py-1.5 shadow-sm border border-[rgba(214,185,140,0.15)]">
                          <span className="text-[#D6B98C]">{icon}</span>
                          <span className="truncate text-[#5B4636]">
                            <span className="text-[9px] uppercase font-bold text-[#7a6153] mr-1">{label}</span>
                            {value || "—"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#D6B98C]/35 bg-[#D6B98C]/10 px-4 py-2.5 text-sm font-semibold text-[#5B4636] transition active:bg-[#D6B98C]/20"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-700 transition active:bg-rose-500/20"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Hero Section Tab */}
        {activeTab === "hero" && (
          <div className="rounded-[2rem] border border-[rgba(214,185,140,0.3)] bg-[#F3E9DC]/30 p-6 shadow-sm">
            <HeroSectionManager />
          </div>
        )}

      </div>
    </div>
  );
}