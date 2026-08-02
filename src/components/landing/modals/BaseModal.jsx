import React from "react";

let activeScrollLocks = 0;
let scrollLockSnapshot = null;

function restoreStyleAttribute(element, value) {
  if (value === null) {
    element.removeAttribute("style");
  } else {
    element.setAttribute("style", value);
  }
}

function lockBackgroundScroll() {
  activeScrollLocks += 1;

  if (activeScrollLocks === 1) {
    const html = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);

    scrollLockSnapshot = {
      htmlStyle: html.getAttribute("style"),
      bodyStyle: body.getAttribute("style"),
      scrollX,
      scrollY,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";

    if (scrollbarWidth > 0) {
      const paddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    }
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeScrollLocks = Math.max(0, activeScrollLocks - 1);
    if (activeScrollLocks > 0 || !scrollLockSnapshot) return;

    const snapshot = scrollLockSnapshot;
    scrollLockSnapshot = null;
    restoreStyleAttribute(document.documentElement, snapshot.htmlStyle);
    restoreStyleAttribute(document.body, snapshot.bodyStyle);
    window.scrollTo(snapshot.scrollX, snapshot.scrollY);
  };
}

export function BaseModal({ onClose, modalBgClass = "mfi-modal-bg", modalClass = "mfi-modal", hideCloseButton = false, closeButtonClass = "", restoreFocusOnClose = true, label = "dialog", children }) {
  const modalRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  const restoreFocusOnCloseRef = React.useRef(restoreFocusOnClose);

  onCloseRef.current = onClose;
  restoreFocusOnCloseRef.current = restoreFocusOnClose;

  React.useEffect(() => {
    const previouslyFocused = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
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
    const unlockBackgroundScroll = lockBackgroundScroll();

    // Keep focus inside the dialog without preselecting the first control.
    modalRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockBackgroundScroll();
      if (restoreFocusOnCloseRef.current && previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

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
