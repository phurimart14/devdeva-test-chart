import type { ChartDataPoint, LineConfig } from "../types/chart";

/**
 * Random ตัวเลขในช่วง [min, max] (รวม min, max)
 */
function randomInRange(min: number, max: number, decimals = 0): number {
  const value = Math.random() * (max - min) + min;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format ตัวเลขเป็น "HH:00"
 */
function formatHour(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`;
}

/**
 * สร้างข้อมูลกราฟ 24 ชั่วโมง (00:00 ถึง 23:00)
 */
export function generateMockData(): ChartDataPoint[] {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: formatHour(i),
    green: randomInRange(0, 100),
    yellow: randomInRange(-100, 100),
    blue: randomInRange(0, 10, 1), // 1 ทศนิยม ให้เส้นลื่นขึ้น
  }));
}

/**
 * Config ของ 3 เส้น
 *
 * ⚠️ ลำดับใน array นี้ = ลำดับ render YAxis ใน JSX
 * ใน Recharts: YAxis ที่ render ก่อน = อยู่ติดกราฟ → render หลัง = ออกซ้าย
 *
 * Spec ต้องการ axes ซ้าย→ขวา: น้ำเงิน → ส้ม → เขียว
 * ดังนั้น render order ต้องเป็น: เขียว (ติดกราฟ) → ส้ม → น้ำเงิน (ซ้ายสุด)
 */
export const LINE_CONFIGS: LineConfig[] = [
  {
    key: 'green',
    label: 'สีเขียว',
    color: 'var(--color-chart-green)',
    yAxisId: '1-green',   // ← prefix ตัวเลข เพื่อ control alphabetical sort
    domain: [0, 100],
  },
  {
    key: 'yellow',
    label: 'สีส้ม',
    color: 'var(--color-chart-yellow)',
    yAxisId: '2-yellow',  // ← กลาง
    domain: [-100, 100],
  },
  {
    key: 'blue',
    label: 'สีน้ำเงิน',
    color: 'var(--color-chart-blue)',
    yAxisId: '3-blue',    // ← ซ้ายสุด
    domain: [0, 10],
  },
];