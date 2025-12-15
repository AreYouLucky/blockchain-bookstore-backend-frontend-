import { useEffect } from "react";
import MicroModal from "react-micro-modal";

export default function Modal({
  open,
  onClose,
  children,

}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <MicroModal
      open={open}
      onClose={onClose}
      overlayClassName="fixed inset-0 z-50 bg-black/50 flex items-center justify-center rounded-lg shadow-2xl min-w-4xl"
    >
      {() => (
        <div
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </MicroModal>
  );
}
