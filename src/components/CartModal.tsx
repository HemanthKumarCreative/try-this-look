import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { storage } from "@/utils/storage";
import { CartItem } from "@/types/tryon";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function CartModal({ isOpen, onClose, onCheckout }: CartModalProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (isOpen) setItems(storage.getCartItems());
  }, [isOpen]);

  const handleQuantity = (id: string, qty: number) => {
    const next = Math.max(1, qty);
    storage.updateCartItemQuantity(id, next);
    setItems(storage.getCartItems());
  };

  const handleRemove = (id: string) => {
    storage.removeFromCart(id);
    setItems(storage.getCartItems());
  };

  const handleClear = () => {
    storage.clearCart();
    setItems([]);
  };

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-full sm:max-w-lg p-0 rounded-none sm:rounded-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <div className="p-4 sm:p-5 md:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Panier</h2>

          {items.length === 0 ? (
            <Card className="p-4 sm:p-6 text-center text-muted-foreground">
              <p className="text-sm sm:text-base">Votre panier est vide.</p>
            </Card>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="p-2 sm:p-3 flex gap-2 sm:gap-3 items-start sm:items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-neutral-50 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-auto object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-2">
                    <p className="font-medium truncate text-sm sm:text-base">{item.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">€ {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1 sm:mt-2">
                      <Button variant="outline" size="sm" aria-label="Decrease" onClick={() => handleQuantity(item.id, item.quantity - 1)} className="h-8 w-8 sm:h-9 sm:w-9 p-0 min-w-[32px] sm:min-w-[36px] flex items-center justify-center">
                        <span className="text-sm sm:text-base">-</span>
                      </Button>
                      <span className="w-8 sm:w-10 text-center text-sm sm:text-base font-medium" aria-live="polite">{item.quantity}</span>
                      <Button variant="outline" size="sm" aria-label="Increase" onClick={() => handleQuantity(item.id, item.quantity + 1)} className="h-8 w-8 sm:h-9 sm:w-9 p-0 min-w-[32px] sm:min-w-[36px] flex items-center justify-center">
                        <span className="text-sm sm:text-base">+</span>
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => handleRemove(item.id)} aria-label="Remove" className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">Supprimer</Button>
                </Card>
              ))}

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-3 sm:mt-4">
                <p className="font-semibold text-sm sm:text-base md:text-lg">Total</p>
                <p className="font-bold text-sm sm:text-base md:text-lg">€ {total.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                <Button variant="outline" onClick={handleClear} className="h-11 sm:h-12 text-sm sm:text-base">Vider</Button>
                <Button onClick={() => { onClose(); onCheckout?.(); }} className="h-11 sm:h-12 text-sm sm:text-base">Payer</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


