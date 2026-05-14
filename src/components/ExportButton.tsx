import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { exportChartToPdf } from '../lib/exportPdf';
import type { ChartDataPoint, LineConfig } from '../types/chart';

interface ExportButtonProps {
  /** ข้อมูลกราฟที่จะ export */
  data: ChartDataPoint[];
  /** Config ของเส้น */
  lineConfigs: LineConfig[];
  /** ชื่อไฟล์ (ไม่ต้องมี .pdf) */
  filename?: string;
}

/**
 * ปุ่ม Export PDF
 * - เปลี่ยนจากการส่ง ref → ส่ง data ตรงๆ
 * - exportChartToPdf จะ render กราฟใหม่ใน offscreen container
 */
export function ExportButton({
  data,
  lineConfigs,
  filename = 'daily-graph',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      await exportChartToPdf(data, lineConfigs, filename);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('ไม่สามารถ Export PDF ได้ ลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="
        inline-flex items-center gap-2
        px-4 py-2
        bg-card border border-border
        rounded-lg
        text-sm font-medium text-text-primary
        hover:bg-gray-50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        shadow-sm
      "
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          กำลัง Export...
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Export PDF
        </>
      )}
    </button>
  );
}