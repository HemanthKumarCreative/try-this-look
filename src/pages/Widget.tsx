import TryOnWidget from "@/components/TryOnWidget";

export default function Widget() {
  return (
    <div className="w-full h-full" style={{ backgroundColor: "#fef3f3" }}>
      {/* Try-On Widget Content */}
      {/* 
        Product images are extracted from the Shopify product page (parent window) 
        when the widget is loaded in an iframe. The widget requests images from 
        the parent window, which extracts them using Shopify Liquid objects.
      */}
      <TryOnWidget />
    </div>
  );
}
