import { createRoot } from "react-dom/client";
import { createElement } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DailyChart } from "../components/DailyChart";
import type { ChartDataPoint, LineConfig } from "../types/chart";

const EXPORT_WIDTH = 1280;
const EXPORT_HEIGHT = 640; // เพิ่มความสูงให้พอดี title + chart

/**
 * สร้าง JSX ของ "Chart Card" สำหรับ export
 * - มี title "Daily Graph"
 * - มี DailyChart ที่ปิด animation
 * - มี padding + border-radius สวยๆ เหมือนใน UI
 */
function createExportContent(
  data: ChartDataPoint[],
  lineConfigs: LineConfig[],
) {
  return createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        padding: "32px",
        background: "#f9fafb",
        boxSizing: "border-box",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
    },

    // Page Header (H1 + subtitle)
    createElement(
      "div",
      { style: { marginBottom: "20px" } },
      createElement(
        "h1",
        {
          style: {
            fontSize: "30px",
            fontWeight: 700,
            color: "#111827",
            margin: "0 0 4px 0",
            letterSpacing: "-0.025em",
          },
        },
        "Daily Graph",
      ),
      createElement(
        "p",
        {
          style: {
            fontSize: "14px",
            color: "#6b7280",
            margin: 0,
          },
        },
        "Multi-axis line chart — 3 metrics over 24 hours",
      ),
    ),

    // Chart Card
    createElement(
      "div",
      {
        style: {
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        },
      },
      createElement(
        "h2",
        {
          style: {
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827",
            margin: "0 0 16px 0",
          },
        },
        "Daily Graph",
      ),
      createElement(DailyChart, {
        data,
        lineConfigs,
        animationDuration: 0,
      }),
    ),
  );
}

/**
 * Export กราฟเป็น PDF ที่ขนาดคงที่
 */
export async function exportChartToPdf(
  data: ChartDataPoint[],
  lineConfigs: LineConfig[],
  filename = "daily-graph",
): Promise<void> {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: ${EXPORT_WIDTH}px;
    height: ${EXPORT_HEIGHT}px;
    background: #ffffff;
  `;
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    root.render(createExportContent(data, lineConfigs));

    // รอ render + ResponsiveContainer วัด size + Recharts วาด
    // 600ms = ปลอดภัยมาก แม้บน device ช้า
    await new Promise((resolve) => setTimeout(resolve, 600));

    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const imageAspect = canvas.width / canvas.height;
    const pageAspect = maxWidth / maxHeight;

    let imageWidth: number;
    let imageHeight: number;

    if (imageAspect > pageAspect) {
      imageWidth = maxWidth;
      imageHeight = maxWidth / imageAspect;
    } else {
      imageHeight = maxHeight;
      imageWidth = maxHeight * imageAspect;
    }

    const x = (pageWidth - imageWidth) / 2;
    const y = (pageHeight - imageHeight) / 2;

    pdf.addImage(imageData, "PNG", x, y, imageWidth, imageHeight);
    pdf.save(`${filename}.pdf`);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}
