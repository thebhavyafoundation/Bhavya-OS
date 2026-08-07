"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface A11yContextValue {
  announce: (message: string) => void;
  focusTrap: (container: HTMLElement) => void;
  releaseFocusTrap: () => void;
  trapContainer: HTMLElement | null;
}

const A11yContext = createContext<A11yContextValue>({
  announce: () => {},
  focusTrap: () => {},
  releaseFocusTrap: () => {},
  trapContainer: null,
});

export function useA11y() {
  return useContext(A11yContext);
}

export default function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [trapContainer, setTrapContainer] = useState<HTMLElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const announce = useCallback((message: string) => {
    const el = document.getElementById("a11y-announcer");
    if (el) {
      el.textContent = "";
      requestAnimationFrame(() => {
        el.textContent = message;
      });
    }
  }, []);

  const focusTrap = useCallback((container: HTMLElement) => {
    previousFocus.current = document.activeElement as HTMLElement;
    setTrapContainer(container);
    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) focusable[0].focus();
  }, []);

  const releaseFocusTrap = useCallback(() => {
    setTrapContainer(null);
    previousFocus.current?.focus();
    previousFocus.current = null;
  }, []);

  useEffect(() => {
    if (!trapContainer) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = trapContainer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    trapContainer.addEventListener("keydown", handler);
    return () => trapContainer.removeEventListener("keydown", handler);
  }, [trapContainer]);

  return (
    <A11yContext.Provider
      value={{ announce, focusTrap, releaseFocusTrap, trapContainer }}
    >
      {children}
      <div
        id="a11y-announcer"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </A11yContext.Provider>
  );
}
