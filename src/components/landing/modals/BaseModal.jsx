import React from "react";

export function BaseModal({ onClose, modalBgClass = "mfi-modal-bg", modalClass = "mfi-modal", hideCloseButton = false, closeButtonClass = "", restoreFocusOnClose = true, label = "dialog", children }) {
  const modalRef = React.useRef(null);

  React.useEffect(() => {
    const previouslyFocused = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Lock background scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Keep focus inside the dialog without preselecting the first control.
    modalRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (restoreFocusOnClose && previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose, restoreFocusOnClose]);

  return (
    <div className={modalBgClass} onClick={onClose}>
      <div
        ref={modalRef}
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideCloseButton && <button className={`x ${closeButtonClass}`.trim()} onClick={onClose} aria-label="close">×</button>}
        {children}
      </div>
    </div>
  );
}
