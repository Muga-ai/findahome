// app/listings/page.tsx
import { Suspense } from "react";
import ListingsContent from "./ListingsContent";

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading listings...</p>
          </div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}