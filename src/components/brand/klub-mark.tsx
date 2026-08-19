import Image from "next/image";

const LOGO_ASPECT_RATIO = 1222 / 475;

export function KlubMark({
  lojaNome,
  height = 24,
}: {
  lojaNome?: string;
  height?: number;
}) {
  const width = Math.round(height * LOGO_ASPECT_RATIO);
  const labelSize = Math.max(9, Math.round(height * 0.34));

  return (
    <span className="relative inline-flex shrink-0" style={{ height, width }}>
      <Image src="/brand/klub-logo.png" alt="Klub" width={width} height={height} priority />
      {lojaNome && (
        <span
          className="font-lazare absolute whitespace-nowrap leading-none text-fg"
          style={{
            fontSize: labelSize,
            left: Math.round(width * 0.68),
            top: -Math.round(labelSize * 0.6),
          }}
        >
          {lojaNome}
        </span>
      )}
    </span>
  );
}
