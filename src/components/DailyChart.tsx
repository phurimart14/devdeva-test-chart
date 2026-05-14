import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint, LineConfig } from "../types/chart";
import { CustomTooltip } from "./CustomTooltip";
import { useViewportSize } from "../hooks/useViewportSize"; // ← Fix #1: แก้ path

interface DailyChartProps {
  data: ChartDataPoint[];
  lineConfigs: LineConfig[];
  /** ระยะเวลา animation (ms) — ใส่ 0 เพื่อปิด animation สำหรับ export */
  animationDuration?: number;
  /**
   * Force viewport size (override auto-detect)
   * ใช้ตอน export PDF ที่อยาก force desktop view
   */
  forceViewport?: "mobile" | "tablet" | "desktop";
}

/**
 * Config ของแต่ละ viewport — ปรับ axis/chart ให้เหมาะกับขนาดจอ
 */
const VIEWPORT_CONFIG = {
  mobile: {
    height: 280, // ← Fix #2: เตี้ยลง
    yAxisWidth: 28, // ← แคบลงมาก
    xAxisFontSize: 9, // ← เล็กลง
    yAxisFontSize: 8, // ← เล็กลง
    showEveryHour: 4, // ← แสดงทุก 4 ชม. (00, 04, 08, 12, 16, 20)
  },
  tablet: {
    height: 380,
    yAxisWidth: 42,
    xAxisFontSize: 11,
    yAxisFontSize: 10,
    showEveryHour: 2, // ← แสดงทุก 2 ชม.
  },
  desktop: {
    height: 440,
    yAxisWidth: 50,
    xAxisFontSize: 12,
    yAxisFontSize: 11,
    showEveryHour: 1, // ← แสดงทุกชั่วโมง
  },
} as const;

export function DailyChart({
  data,
  lineConfigs,
  animationDuration = 800,
  forceViewport,
}: DailyChartProps) {
  const detectedViewport = useViewportSize();
  const viewport = forceViewport ?? detectedViewport;
  const config = VIEWPORT_CONFIG[viewport];

  const isAnimationActive = animationDuration > 0;
  const isMobile = viewport === "mobile";

  return (
    <ResponsiveContainer width="100%" height={config.height}>
      <ComposedChart
        data={data}
        // Fix #4: ลด margin บน mobile
        margin={{
          top: 20,
          right: isMobile ? 10 : 30,
          left: isMobile ? 0 : 20,
          bottom: 20,
        }}
      >
        <defs>
          {lineConfigs.map((c) => (
            <linearGradient
              key={`gradient-${c.key}`}
              id={`gradient-${c.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={c.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={c.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* Fix #3: ใช้ tickFormatter แทน interval — control ได้แม่นกว่า */}
        <XAxis
          dataKey="hour"
          stroke="#6b7280"
          fontSize={config.xAxisFontSize}
          tickLine={false}
          interval={0} // ← ให้ Recharts แสดงทุก tick แต่เรา filter ใน tickFormatter
          tickFormatter={(value: string) => {
            // value = "00:00", "01:00", ..., "23:00"
            const hour = parseInt(value.split(":")[0], 10);
            // แสดงเฉพาะที่หาร showEveryHour ลงตัว
            return hour % config.showEveryHour === 0 ? value : "";
          }}
        />

        {lineConfigs.map((c) => (
          <YAxis
            key={c.yAxisId}
            yAxisId={c.yAxisId}
            domain={c.domain}
            orientation="left"
            stroke={c.color}
            fontSize={config.yAxisFontSize}
            tickLine={false}
            axisLine={false}
            width={config.yAxisWidth}
          />
        ))}

        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ paddingTop: "12px" }}
          formatter={(value) => {
            const cfg = lineConfigs.find((c) => c.key === value);
            return (
              <span style={{ color: "#374151", fontSize: "13px" }}>
                {cfg?.label ?? value}
              </span>
            );
          }}
        />

        <Tooltip
          content={<CustomTooltip lineConfigs={lineConfigs} />}
          cursor={{
            stroke: "#9ca3af",
            strokeWidth: 1,
            strokeDasharray: "3 3",
          }}
        />

        {lineConfigs.map((c) => (
          <Area
            key={`area-${c.key}`}
            type="monotone"
            dataKey={c.key}
            yAxisId={c.yAxisId}
            stroke="none"
            fill={`url(#gradient-${c.key})`}
            fillOpacity={1}
            isAnimationActive={false}
            legendType="none"
          />
        ))}

        {lineConfigs.map((c) => (
          <Line
            key={`line-${c.key}`}
            type="monotone"
            dataKey={c.key}
            yAxisId={c.yAxisId}
            stroke={c.color}
            strokeWidth={2}
            dot={{ r: 3, fill: c.color }}
            activeDot={{ r: 5 }}
            animationDuration={animationDuration}
            isAnimationActive={isAnimationActive}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
