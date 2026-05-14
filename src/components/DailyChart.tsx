import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint, LineConfig } from "../types/chart";
import { CustomTooltip } from "./CustomToolTip";

interface DailyChartProps {
  data: ChartDataPoint[];
  lineConfigs: LineConfig[];
  /** ระยะเวลา animation (ms) — ใส่ 0 เพื่อปิด animation สำหรับ export */
  animationDuration?: number;
}

export function DailyChart({
  data,
  lineConfigs,
  animationDuration = 800,
}: DailyChartProps) {
  // ถ้า duration = 0 → ปิด animation ด้วย
  const isAnimationActive = animationDuration > 0;
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        {/* Gradients สำหรับ Area fill */}
        <defs>
          {lineConfigs.map((config) => (
            <linearGradient
              key={`gradient-${config.key}`}
              id={`gradient-${config.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} tickLine={false} />

        {lineConfigs.map((config) => (
          <YAxis
            key={config.yAxisId}
            yAxisId={config.yAxisId}
            domain={config.domain}
            orientation="left"
            stroke={config.color}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={50}
          />
        ))}

        {/*
          Custom Tooltip + vertical cursor line
          - content: ส่ง CustomTooltip component (Recharts จะ inject props ให้)
          - cursor: เส้น vertical ตอน hover (เหมือนใน PDF)
        */}
        <Tooltip
          content={<CustomTooltip lineConfigs={lineConfigs} />}
          cursor={{
            stroke: "#9ca3af", // สีเทากลาง
            strokeWidth: 1,
            strokeDasharray: "3 3", // เส้นประ
          }}
        />

        {/* Areas (ใต้เส้น) */}
        {lineConfigs.map((config) => (
          <Area
            key={`area-${config.key}`}
            type="monotone"
            dataKey={config.key}
            yAxisId={config.yAxisId}
            stroke="none"
            fill={`url(#gradient-${config.key})`}
            fillOpacity={1}
            isAnimationActive={false}
          />
        ))}

        {/* Lines */}
        {lineConfigs.map((config) => (
          <Line
            key={`line-${config.key}`}
            type="monotone"
            dataKey={config.key}
            yAxisId={config.yAxisId}
            stroke={config.color}
            strokeWidth={2}
            dot={{ r: 3, fill: config.color }}
            activeDot={{ r: 5 }}
            animationDuration={animationDuration} // ← ใช้จาก prop
            isAnimationActive={isAnimationActive}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
