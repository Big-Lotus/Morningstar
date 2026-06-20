type SplineComputerProps = {
  className?: string;
  label?: string;
  variant?: "card" | "stage" | "background";
};

const splineUrl = "/api/spline";

export function SplineComputer({
  className = "",
  label,
  variant = "card"
}: SplineComputerProps) {
  const isImmersive = variant === "stage" || variant === "background";
  const isBackground = variant === "background";

  return (
    <div
      className={`overflow-hidden ${
        isImmersive
          ? "bg-[radial-gradient(circle_at_50%_42%,rgba(91,190,178,0.2),transparent_35%),linear-gradient(180deg,#fffffc_0%,#eef8f6_54%,#f7f7f3_100%)]"
          : "relative rounded-[1.75rem] border border-line/80 bg-paper shadow-soft"
      } ${className}`}
    >
      <iframe
        src={splineUrl}
        title="Interactive 3D computer"
        frameBorder="0"
        className={
          isImmersive
            ? `absolute inset-0 z-0 h-full w-full border-0 ${
                isBackground ? "pointer-events-none" : ""
              }`
            : "h-full min-h-[320px] w-full"
        }
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="eager"
      />
      {label ? (
        <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-line/80 bg-paper/86 px-4 py-2 text-xs font-medium text-clay shadow-soft backdrop-blur-md">
          {label}
        </div>
      ) : null}
    </div>
  );
}
