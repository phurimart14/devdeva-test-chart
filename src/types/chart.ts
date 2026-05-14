/**
 * ข้อมูล 1 จุดบนกราฟ = 1 ชั่วโมง
 * - hour: "00:00", "01:00", ..., "23:00"
 * - green: 0 ถึง 100  → เส้นสีเขียว
 * - yellow: -100 ถึง 100 → เส้นสีเหลือง/ส้ม
 * - blue: 0 ถึง 10 → เส้นสีน้ำเงิน
 */
export interface ChartDataPoint {
  hour: string;
  green: number;
  yellow: number;
  blue: number;
}

/**
 * Config ของแต่ละเส้น — รวบ logic ไว้ที่เดียว (Single Source of Truth)
 */
export interface LineConfig {
  key: keyof Omit<ChartDataPoint, 'hour'>;  // 'green' | 'yellow' | 'blue'
  label: string;                              // ชื่อใน Tooltip / Legend
  color: string;                              // CSS color
  yAxisId: string;                            // ผูกกับ YAxis ตัวไหน
  domain: [number, number];                   // scale ของ axis นี้
}