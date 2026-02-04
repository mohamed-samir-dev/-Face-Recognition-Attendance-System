'use client';

interface ModalOverlayProps {
  children: React.ReactNode;
}

export default function ModalOverlay({ children }: ModalOverlayProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/30">
        {children}
      </div>
    </div>
  );
}