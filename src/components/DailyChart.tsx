import {
  LineChart,
  Line,
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
 * กราฟเส้น 3 เส้น พร้อม 3 Y-axes (scale ต่างกัน)
 *
 * Layout (ซ้าย→ขวา): น้ำเงิน → ส้ม → เขียว → [กราฟ]
 *
 * ⚠️ ลำดับ render YAxis สำคัญ — ตัวแรกใน JSX = อยู่ติดกราฟ
 *    เราจึงต้องเรียง LINE_CONFIGS ให้ "ตัวที่อยากให้ติดกราฟ" มาก่อน
 */
export function DailyChart({ data, lineConfigs }: DailyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        {/* Grid พื้นหลัง */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* X-axis: ชั่วโมง 00:00 - 23:00 */}
        <XAxis
          dataKey="hour"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />

        {/* Y-axes 3 ตัว — render ตามลำดับ lineConfigs (สำคัญ!) */}
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

        {/* Tooltip default ไปก่อน — Step 6 จะ custom */}
        <Tooltip />

        {/* Lines 3 เส้น */}
        {lineConfigs.map((config) => (
          <Line
            key={config.key}
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
      </LineChart>
    </ResponsiveContainer>
  );
}