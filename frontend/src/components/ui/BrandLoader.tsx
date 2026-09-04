type BrandLoaderProps = {
  label?: string;
  fullscreen?: boolean;
};

export function BrandLoader({
  label = "Loading…",
  fullscreen = false,
}: BrandLoaderProps) {
  return (
    <div
      className={`brand-loader${fullscreen ? " brand-loader--fullscreen" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <img
        className="brand-loader-logo"
        src="/lazy-janes-logo.svg"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-loader-spinner" aria-hidden="true" />
      <span className="brand-loader-label">{label}</span>
    </div>
  );
}
