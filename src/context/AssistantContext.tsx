import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import AssistantPanel from "../components/assistant/AssistantPanel";

interface AssistantCtx {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Ctx = createContext<AssistantCtx | null>(null);

/** Lets any button on the site open the AI assistant chat. */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((o) => !o), []);
  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AssistantPanel open={isOpen} onClose={close} />
    </Ctx.Provider>
  );
}

export function useAssistant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAssistant must be used inside AssistantProvider");
  return ctx;
}
