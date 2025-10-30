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
      <DialogContent className="sm:max-w-lg p-0">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Panier</h2>

          {items.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Votre panier est vide.
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="p-3 flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">€ {item.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="sm" aria-label="Decrease" onClick={() => handleQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span className="w-8 text-center" aria-live="polite">{item.quantity}</span>
                      <Button variant="outline" size="sm" aria-label="Increase" onClick={() => handleQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => handleRemove(item.id)} aria-label="Remove">Supprimer</Button>
                </Card>
              ))}

              <div className="flex items-center justify-between pt-2">
                <p className="font-semibold">Total</p>
                <p className="font-bold">€ {total.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleClear}>Vider</Button>
                <Button onClick={() => { onClose(); onCheckout?.(); }}>Payer</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


