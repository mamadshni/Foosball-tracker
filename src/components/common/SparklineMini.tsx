import { Box } from "@mui/material";

interface Props {
  data: number[]; // most recent first
  width?: number;
  height?: number;
  stroke?: string;
  zeroLine?: boolean;
}

export default function SparklineMini({ data, width = 80, height = 28, stroke = '#1976d2', zeroLine = true }: Props) {
  if (!data || data.length === 0) return <Box sx={{ width, height }} />;
  const values = [...data].reverse(); // left-to-right oldest to newest
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const range = max - min || 1;
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const path = `M ${points[0]} ` + points.slice(1).map((p) => `L ${p}`).join(' ');
  const zeroY = pad + h - ((0 - min) / range) * h;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {zeroLine && <line x1={0} y1={zeroY} x2={width} y2={zeroY} stroke="#e0e0e0" strokeWidth={1} />}
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} />
    </svg>
  );
}

