import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  /** Callback เมื่อกดปุ่ม */
  onRefresh: () => void;
}

/**
 * ปุ่ม Refresh Data — สุ่มข้อมูลใหม่
 */
export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  return (
    <button
      onClick={onRefresh}
      className="
        inline-flex items-center gap-2
        px-4 py-2
        bg-card border border-border
        rounded-lg
        text-sm font-medium text-text-primary
        hover:bg-gray-50
        active:bg-gray-100
        transition-colors
        shadow-sm
      "
      title="Refresh data (random new values)"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>
  );
}