import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import ContactModal from "../components/ContactModal";

interface ContactModalCtx {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<ContactModalCtx | null>(null);

/** Lets any button on the site open the "Let's talk" message pop-up. */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <ContactModal open={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContactModal must be used inside ContactModalProvider");
  return ctx;
}
