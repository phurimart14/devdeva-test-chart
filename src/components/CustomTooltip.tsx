import type { LineConfig } from '../types/chart';

/**
 * 1 item ใน payload ที่ Recharts ส่งมา
 * - dataKey: key ของเส้น ('green' | 'yellow' | 'blue')
 * - value: ค่าของเส้นนั้น ณ จุด hover
 * - name: ชื่อ (default = dataKey)
 * - color: สีเส้น
 */
interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  name?: string;
  color?: string;
}

/**
 * Props ของ CustomTooltip
 * - active, payload, label → Recharts inject ให้
 * - lineConfigs → เราส่งเอง
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  lineConfigs: LineConfig[];
}

/**
 * Custom Tooltip — แสดงค่าทั้ง 3 เส้น
 */
export function CustomTooltip({
  active,
  payload,
  label,
  lineConfigs,
}: CustomTooltipProps) {
  // ถ้าไม่ active หรือไม่มี data → ไม่แสดง
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 min-w-[140px]">
      {/* Header: ชั่วโมง */}
      <div className="text-xs text-text-secondary mb-1.5 font-medium">
        {label}
      </div>

      {/* 3 บรรทัด: label + value */}
      <div className="space-y-1">
        {lineConfigs.map((config) => {
          const item = payload.find((p) => p.dataKey === config.key);
          if (!item) return null;

          return (
            <div
              key={config.key}
              className="flex items-center justify-between gap-3 text-sm"
            >
              {/* ซ้าย: ชื่อสี + จุดสี */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-text-secondary">{config.label}</span>
              </div>

              {/* ขวา: ค่า */}
              <span
                className="font-semibold tabular-nums"
                style={{ color: config.color }}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}