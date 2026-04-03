import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Camera, TrendingUp, TrendingDown, X, Check } from "lucide-react";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const unitTypes = ["Carton", "Bag", "Roll", "Piece", "Kg", "Litre", "Yard", "Other"];

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  label: string;
  saved: boolean;
}

const AddProductPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera modal state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentCapture, setCurrentCapture] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [detecting, setDetecting] = useState(false);

  // Active product form (selected thumbnail)
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", buyingUnit: "", sellingUnit: "",
    unitsPerBuying: "", totalOrderAmount: "", quantityOrdered: "",
    transportFee: "", actualSellingPrice: "", openingStock: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      console.error("Camera access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const openCameraModal = () => {
    setCameraOpen(true);
    setCurrentCapture(null);
    setLabelInput("");
  };

  const closeCameraModal = () => {
    stopCamera();
    setCameraOpen(false);
    setCurrentCapture(null);
    setLabelInput("");
    // If we have photos and no active one, select the first unsaved
    if (capturedPhotos.length > 0 && !activePhotoId) {
      const first = capturedPhotos.find((p) => !p.saved) || capturedPhotos[0];
      selectThumbnail(first);
    }
  };

  useEffect(() => {
    if (cameraOpen && !currentCapture) {
      startCamera();
    }
    return () => {
      if (!cameraOpen) stopCamera();
    };
  }, [cameraOpen, currentCapture, startCamera, stopCamera]);

  // Simulate AI auto-capture after stable frame detection
  useEffect(() => {
    if (!cameraOpen || currentCapture) return;
    setDetecting(true);
    const timer = setTimeout(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setCurrentCapture(dataUrl);
          setDetecting(false);
        }
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [cameraOpen, currentCapture]);

  const saveLabel = () => {
    if (!currentCapture || !labelInput.trim()) return;
    const newPhoto: CapturedPhoto = {
      id: Date.now().toString(),
      dataUrl: currentCapture,
      label: labelInput.trim(),
      saved: false,
    };
    setCapturedPhotos((prev) => [...prev, newPhoto]);
    setCurrentCapture(null);
    setLabelInput("");
    // Camera continues for next product
  };

  const selectThumbnail = (photo: CapturedPhoto) => {
    setActivePhotoId(photo.id);
    setForm((prev) => ({
      ...prev,
      name: photo.label,
      buyingUnit: "", sellingUnit: "", unitsPerBuying: "",
      totalOrderAmount: "", quantityOrdered: "", transportFee: "",
      actualSellingPrice: "", openingStock: "",
    }));
  };

  const saveProduct = () => {
    if (activePhotoId) {
      setCapturedPhotos((prev) =>
        prev.map((p) => (p.id === activePhotoId ? { ...p, saved: true } : p))
      );
      // Move to next unsaved
      const next = capturedPhotos.find((p) => p.id !== activePhotoId && !p.saved);
      if (next) {
        selectThumbnail(next);
      } else {
        setActivePhotoId(null);
        setForm({
          name: "", buyingUnit: "", sellingUnit: "", unitsPerBuying: "",
          totalOrderAmount: "", quantityOrdered: "", transportFee: "",
          actualSellingPrice: "", openingStock: "",
        });
      }
    }
  };

  // Calculations
  const calc = useMemo(() => {
    const units = parseFloat(form.unitsPerBuying) || 0;
    const totalOrder = parseFloat(form.totalOrderAmount) || 0;
    const qtyOrdered = parseFloat(form.quantityOrdered) || 0;
    const transport = parseFloat(form.transportFee) || 0;
    const asp = parseFloat(form.actualSellingPrice) || 0;

    const cogPerBuying = qtyOrdered > 0 ? totalOrder / qtyOrdered : 0;
    const expPerBuying = qtyOrdered > 0 ? transport / qtyOrdered : 0;
    const totalCostPerBuying = cogPerBuying + expPerBuying;
    const costPerSelling = units > 0 ? totalCostPerBuying / units : 0;
    const minViablePrice = costPerSelling * 1.1;
    const idealPrice = costPerSelling * 1.3;
    const marginPerUnit = asp - costPerSelling;
    const marginPct = costPerSelling > 0 ? ((asp - costPerSelling) / costPerSelling) * 100 : 0;

    let verdictLabel = "";
    let verdictColor = "";
    if (asp > 0 && costPerSelling > 0) {
      if (marginPerUnit < 0) { verdictLabel = "Selling at a loss"; verdictColor = "text-critical"; }
      else if (marginPct < 15) { verdictLabel = "Low margin"; verdictColor = "text-warning"; }
      else { verdictLabel = "Healthy margin"; verdictColor = "text-success"; }
    }

    return { cogPerBuying, expPerBuying, totalCostPerBuying, costPerSelling, minViablePrice, idealPrice, marginPerUnit, marginPct, verdictLabel, verdictColor };
  }, [form.unitsPerBuying, form.totalOrderAmount, form.quantityOrdered, form.transportFee, form.actualSellingPrice]);

  const fmt = (n: number) => `₦${Math.round(n).toLocaleString()}`;

  const SelectField = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Select</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );

  const TextField = ({ label, placeholder, value, onChange, type = "text", prefix }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; prefix?: string }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 ${prefix ? "pl-8" : "px-4"} pr-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary`} />
      </div>
    </div>
  );

  const ReadOnlyField = ({ label, value, color = "text-foreground" }: { label: string; value: string; color?: string }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className={`w-full h-12 px-4 rounded-lg border border-input bg-muted/50 flex items-center text-sm font-semibold ${color}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-base font-bold text-foreground">Add Product</h1>
          <div className="w-12" />
        </div>

        {/* Camera Card / Thumbnail Strip */}
        {capturedPhotos.length === 0 ? (
          <button onClick={openCameraModal} className="w-full h-28 rounded-lg border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tap to add product photos</span>
          </button>
        ) : (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Captured Products</span>
              <button onClick={openCameraModal} className="ml-auto text-xs text-primary font-medium">+ Add More</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {capturedPhotos.map((photo) => (
                <button key={photo.id} onClick={() => selectThumbnail(photo)}
                  className={`flex-shrink-0 w-20 flex flex-col items-center gap-1 relative ${activePhotoId === photo.id ? "ring-2 ring-primary rounded-lg" : ""}`}>
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted relative">
                    <img src={photo.dataUrl} alt={photo.label} className="w-full h-full object-cover" />
                    {photo.saved && (
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                          <Check className="w-4 h-4 text-success-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground text-center truncate w-full">{photo.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {cameraOpen && (
          <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-base font-bold text-foreground">Capture Products</span>
              <button onClick={closeCameraModal} className="text-muted-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Badge */}
            {capturedPhotos.length > 0 && (
              <div className="absolute top-4 right-14 z-10 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {capturedPhotos.length}
              </div>
            )}

            <div className="flex-1 relative overflow-hidden">
              {!currentCapture ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  {/* Scanning frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-56 h-56 border-2 rounded-xl ${detecting ? "border-primary animate-pulse" : "border-muted-foreground/40"}`} />
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <span className="text-xs text-muted-foreground bg-background/70 px-3 py-1.5 rounded-full">
                      {detecting ? "Detecting product…" : "Point camera at product"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative">
                  <img src={currentCapture} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                    <label className="text-sm font-medium text-foreground block mb-2">Name this product</label>
                    <input
                      type="text"
                      value={labelInput}
                      onChange={(e) => setLabelInput(e.target.value)}
                      placeholder="Name this product"
                      autoFocus
                      className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                    />
                    <button onClick={saveLabel} disabled={!labelInput.trim()}
                      className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40">
                      Save & Capture Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-4">
              <button onClick={closeCameraModal} className="w-full h-12 rounded-lg border border-border bg-card text-foreground font-semibold text-sm">
                Done ({capturedPhotos.length} product{capturedPhotos.length !== 1 ? "s" : ""})
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Product Info */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Info</p>
          <TextField label="Product Name" placeholder="e.g. Indomie Chicken (70g)" value={form.name} onChange={(v) => update("name", v)} />

          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Buying Unit" value={form.buyingUnit} onChange={(v) => update("buyingUnit", v)} options={unitTypes} />
            <SelectField label="Selling Unit" value={form.sellingUnit} onChange={(v) => update("sellingUnit", v)} options={unitTypes} />
          </div>

          <TextField label="Units per Buying Unit" placeholder="e.g. 12" value={form.unitsPerBuying} onChange={(v) => update("unitsPerBuying", v)} type="number" />

          {/* Cost Calculator — Order Details */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Order Details</p>
          </div>

          <TextField label="Total amount paid for this order" placeholder="e.g. ₦50,000" value={form.totalOrderAmount} onChange={(v) => update("totalOrderAmount", v)} type="number" prefix="₦" />
          <TextField label="How many buying units did you order?" placeholder="e.g. 10 cartons" value={form.quantityOrdered} onChange={(v) => update("quantityOrdered", v)} type="number" />
          <TextField label="Total transport and handling for this order" placeholder="e.g. ₦2,000" value={form.transportFee} onChange={(v) => update("transportFee", v)} type="number" prefix="₦" />

          <ReadOnlyField label="Cost of Goods per Buying Unit" value={calc.cogPerBuying > 0 ? fmt(calc.cogPerBuying) : "—"} color="text-primary" />
          <ReadOnlyField label="Expenses per Buying Unit" value={calc.expPerBuying > 0 ? fmt(calc.expPerBuying) : "—"} color="text-primary" />
          <ReadOnlyField label="Total Cost per Buying Unit" value={calc.totalCostPerBuying > 0 ? fmt(calc.totalCostPerBuying) : "—"} />
          <ReadOnlyField label="Cost per Selling Unit" value={calc.costPerSelling > 0 ? fmt(calc.costPerSelling) : "—"} />

          {/* Pricing */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Pricing</p>
          </div>

          <ReadOnlyField label="Minimum Viable Price (10% margin)" value={calc.minViablePrice > 0 ? fmt(calc.minViablePrice) : "—"} color="text-warning" />
          <ReadOnlyField label="Ideal Selling Price (30% margin)" value={calc.idealPrice > 0 ? fmt(calc.idealPrice) : "—"} color="text-success" />

          <TextField label="Actual Selling Price" placeholder="Your price per selling unit" value={form.actualSellingPrice} onChange={(v) => update("actualSellingPrice", v)} type="number" prefix="₦" />

          {/* Live Margin */}
          {calc.verdictLabel && (
            <div className={`rounded-lg p-4 border ${calc.verdictColor === "text-success" ? "bg-success/5 border-success/20" : calc.verdictColor === "text-warning" ? "bg-warning/5 border-warning/20" : "bg-critical/5 border-critical/20"}`}>
              <div className="flex items-center gap-2 mb-2">
                {calc.marginPerUnit >= 0 ? <TrendingUp className={`w-4 h-4 ${calc.verdictColor}`} /> : <TrendingDown className="w-4 h-4 text-critical" />}
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{calc.verdictLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Margin per unit</span>
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{fmt(calc.marginPerUnit)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Margin percentage</span>
                <span className={`text-sm font-semibold ${calc.verdictColor}`}>{Math.round(calc.marginPct)}%</span>
              </div>
            </div>
          )}

          {/* Projected Revenue */}
          {(() => {
            const openStock = parseFloat(form.openingStock) || 0;
            const idealRev = openStock * calc.idealPrice;
            const yourRev = openStock * (parseFloat(form.actualSellingPrice) || 0);
            if (openStock > 0 && calc.idealPrice > 0) {
              return (
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Projected Revenue at Ideal Price</p>
                    <p className="text-lg font-bold text-success">{fmt(idealRev)}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">If sold at ideal price (30% margin)</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Projected Revenue at Your Price</p>
                    <p className="text-lg font-bold text-primary">{yourRev > 0 ? fmt(yourRev) : "—"}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">If sold at your price</p>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {/* Stock */}
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Stock</p>
          </div>

          <TextField label="Opening Stock Quantity" placeholder="Current quantity" value={form.openingStock} onChange={(v) => update("openingStock", v)} type="number" />

          <button onClick={saveProduct} className="w-full h-12 mt-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            Save Product
          </button>
        </div>
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default AddProductPage;
