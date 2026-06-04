import React from "react";

export function MediaImage({ src, alt = "", className = "", loading = "lazy", children }) {
  const [status, setStatus] = React.useState("loading");
  const stateClass = status === "loaded" ? "is-loaded" : status === "error" ? "is-error" : "is-loading";

  return (
    <div className={`media-shell ${stateClass} ${className}`.trim()} aria-busy={status === "loading"}>
      <img
        className="media-img"
        draggable={false}
        src={src}
        loading={loading}
        alt={alt}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
      {children}
    </div>
  );
}
