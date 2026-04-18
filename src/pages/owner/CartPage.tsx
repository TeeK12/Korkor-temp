import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import OwnerBottomNav from "@/components/OwnerBottomNav";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, grandTotal } = useCart();

  // Group by distributor
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.distributorId]) {
      acc[item.distributorId] = { name: item.distributorName, items: [] as typeof items };
    }
    acc[item.distributorId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string; items: typeof items }>);

  return (
    <div className="app-shell dark bg-background">
      <div className="page-content px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">My Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <button
              onClick={() => navigate("/owner")}
              className="mt-4 text-sm text-primary font-medium"
            >
              Browse distributors
            </button>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([did, group]) => (
              <div key={did} className="mb-6">
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  {group.name}
                </h3>
                <div className="space-y-2">
                  {group.items.map((it) => (
                    <div
                      key={`${it.productId}-${it.paymentType}`}
                      className="bg-card rounded-lg p-4 border border-border"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{it.productName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              ₦{it.unitPrice.toLocaleString()} / unit
                            </span>
                            {it.paymentType === "goodwill" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">
                                Goodwill
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(it.productId, it.paymentType)}
                          className="text-muted-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(it.productId, it.paymentType, it.quantity - 1)
                            }
                            className="w-7 h-7 rounded-md bg-muted flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3 text-foreground" />
                          </button>
                          <span className="text-sm font-medium text-foreground min-w-[20px] text-center">
                            {it.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(it.productId, it.paymentType, it.quantity + 1)
                            }
                            className="w-7 h-7 rounded-md bg-muted flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3 text-foreground" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          ₦{(it.unitPrice * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Grand total */}
            <div className="bg-card rounded-lg p-4 border border-border mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Grand Total</span>
                <span className="text-2xl font-bold text-foreground">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/owner/checkout")}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-bold"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
      <OwnerBottomNav />
    </div>
  );
};

export default CartPage;
