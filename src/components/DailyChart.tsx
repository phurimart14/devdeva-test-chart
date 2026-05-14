import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint, LineConfig } from '../types/chart';

interface DailyChartProps {
  data: ChartDataPoint[];
  lineConfigs: LineConfig[];
}

/**
 * กราฟเส้น 3 เส้น + Area fill ใต้แต่ละเส้น
 *
 * - ใช้ <ComposedChart> เพื่อรวม <Line> + <Area> ในกราฟเดียว
 * - แต่ละเส้นมี gradient fill ใต้ตัวเอง (linearGradient)
 * - opacity ต่ำ → ไม่บังเส้นอื่น
 */
export function DailyChart({ data, lineConfigs }: DailyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        {/*
          Gradient definitions
          - แต่ละเส้นมี gradient ของตัวเอง (id ตาม key)
          - บนสุด: สีเข้ม opacity 0.3
          - ล่างสุด: สีเดียวกัน opacity 0
          → ทำให้ดูจาง ๆ ไล่ลงไปด้านล่าง
        */}
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

        {/* Grid พื้นหลัง */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* X-axis: ชั่วโมง */}
        <XAxis
          dataKey="hour"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />

        {/* Y-axes 3 ตัว */}
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

        {/* Tooltip default — Step 6 จะ custom */}
        <Tooltip />

        {/*
          Area ใต้แต่ละเส้น — render ก่อน Line
          เพื่อให้ Line อยู่ "ทับ" บน Area (z-order)
        */}
        {lineConfigs.map((config) => (
          <Area
            key={`area-${config.key}`}
            type="monotone"
            dataKey={config.key}
            yAxisId={config.yAxisId}
            stroke="none"                              // ไม่ต้องมีเส้นขอบ (เส้นจริงจะ render จาก <Line>)
            fill={`url(#gradient-${config.key})`}      // ใช้ gradient ที่ define ไว้
            fillOpacity={1}
            isAnimationActive={false}                  // ปิด animation ของ Area (Line จะ animate แทน)
          />
        ))}

        {/* Lines 3 เส้น — render หลัง Area เพื่อให้อยู่ด้านบน */}
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
            animationDuration={800}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}