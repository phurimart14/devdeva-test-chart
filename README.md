# Daily Graph 📊

กราฟ Multi-axis Line Chart พร้อมฟีเจอร์ Export PDF — โจทย์ทดสอบ DEVDEVA Frontend Developer ข้อ 2

> สร้างด้วย React + TypeScript + Recharts + Tailwind CSS v4

---

## 🔗 Live Demo

**👉 [DEMO_URL_HERE]** ← จะใส่หลังจาก Deploy

---

## ✨ ฟีเจอร์

### ตามโจทย์ (Core Requirements)
- ✅ กราฟเส้น 3 เส้นที่ใช้ scale ต่างกัน:
  - 🟢 เส้นสีเขียว: scale 0 ถึง 100
  - 🟠 เส้นสีส้ม: scale -100 ถึง 100
  - 🔵 เส้นสีน้ำเงิน: scale 0 ถึง 10
- ✅ แสดงข้อมูลรายชั่วโมง ทั้งหมด 24 ชั่วโมง
- ✅ Tooltip แสดงค่าทั้ง 3 เส้นเมื่อ hover
- ✅ เส้น cursor แนวตั้งแสดงตำแหน่งที่ hover
- ✅ Export กราฟเป็นไฟล์ PDF

### ฟีเจอร์เพิ่มเติม (Bonus)
- 🎲 **ปุ่ม Refresh** — สุ่มข้อมูลใหม่ได้ตลอด
- 🎨 **Gradient area fill** ใต้เส้นกราฟ (ตามภาพตัวอย่างในโจทย์)
- 📱 **Responsive เต็มรูปแบบ** — รองรับ Desktop / Tablet / Mobile
- 🖼️ **PDF ขนาดคงที่** — ไม่ว่าจะ export จากหน้าจอขนาดไหน PDF ออกมาเหมือนกัน
- 🚀 **ไม่มีปัญหา animation ค้าง** ตอน export (ใช้ off-screen rendering)
- 🎯 **Single Source of Truth** — config ตัวเดียวควบคุมทั้ง chart, tooltip และ legend

---

## 🛠️ เทคโนโลยีที่ใช้

| หมวด | เครื่องมือ |
|------|----------|
| **Framework** | React 18 + TypeScript 5 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **Charts** | Recharts |
| **PDF Export** | html2canvas + jsPDF |
| **Icons** | lucide-react |
| **Utilities** | clsx |

---

## 🚀 วิธีรันโปรเจกต์ในเครื่อง

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/chart-dashboard.git
cd chart-dashboard

# ติดตั้ง dependencies
npm install

# รัน dev server
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

เปิด [http://localhost:5173](http://localhost:5173) ในเบราว์เซอร์

---

## 📂 โครงสร้างโปรเจกต์

```
src/
├── components/
│   ├── DailyChart.tsx        # กราฟหลัก (Recharts ComposedChart)
│   ├── CustomTooltip.tsx     # Tooltip แบบ custom แสดง 3 ค่า
│   ├── ExportButton.tsx      # ปุ่ม Export PDF พร้อม loading state
│   └── RefreshButton.tsx     # ปุ่มสุ่มข้อมูลใหม่
├── hooks/
│   └── useViewportSize.ts    # Hook ตรวจขนาดหน้าจอสำหรับ responsive
├── lib/
│   ├── mockData.ts           # สร้างข้อมูล mock + config ของเส้น
│   └── exportPdf.ts          # ลอจิก export PDF (off-screen render)
├── types/
│   └── chart.ts              # TypeScript interfaces
├── App.tsx                   # Component หลัก
└── index.css                 # Tailwind v4 + theme tokens
```

---

## 🧠 การตัดสินใจทางเทคนิค

### 1. ทำไมเลือก Recharts?
Recharts รองรับ multi-axis ในตัวผ่าน `<YAxis yAxisId>` ถ้าทำเองด้วย D3 จะใช้เวลาประมาณ 3 เท่า สำหรับ scope ของโจทย์นี้ — Recharts คุ้มกว่าเยอะ

### 2. Trick การจัดลำดับ Y-axes
Recharts เรียง YAxis ตามตัวอักษรของ `yAxisId` (alphabetical sort) เพื่อให้ได้ลำดับ **น้ำเงิน → ส้ม → เขียว** (จากนอกเข้าหากราฟ) เลยใส่เลขนำหน้า ID:
```ts
yAxisId: '1-green'   // ติดกราฟ (ในสุด)
yAxisId: '2-yellow'  // กลาง
yAxisId: '3-blue'    // นอกสุด
```

### 3. Off-screen rendering สำหรับ Export PDF
**ปัญหาเดิม:** ถ้าใช้ html2canvas capture DOM โดยตรง — เวลาย่อหน้าจอ กราฟใน PDF จะแคบไปด้วย เพราะ Recharts ใช้ ResponsiveContainer ตามขนาด parent

**วิธีแก้:** ใช้ `ReactDOM.createRoot()` render กราฟใหม่ใน hidden container ขนาด `1280×640` แล้วค่อย capture ทำให้ PDF ออกมาขนาดคงที่ทุกครั้ง ไม่ว่าจะ export จากเครื่องไหน

### 4. การจัดการ Animation ตอน Export
Recharts มี animation วาดเส้นจากซ้ายไปขวา (800ms) — ตอน capture เลยได้กราฟไม่ครบ

**วิธีแก้:** ส่ง prop `animationDuration={0}` เฉพาะตอน render สำหรับ export ส่วน UI ปกติยังเปิด animation ปกติ

### 5. Strategy สำหรับ Responsive
เขียน custom hook `useViewportSize()` ตรวจ breakpoint (mobile / tablet / desktop) แล้วปรับ:
- ความสูงของกราฟ
- ความกว้างของ Y-axis และขนาด font
- ความหนาแน่นของ label X-axis (แสดงทุก 1/2/4 ชั่วโมง ตามขนาดจอ)

### 6. Config-driven Design (Single Source of Truth)
ใช้ `LINE_CONFIGS` เป็นจุดเดียวที่เก็บค่าทั้งหมดของแต่ละเส้น (สี, label, scale, axis ID) — chart, tooltip และ legend ทั้งหมดดึงข้อมูลจาก array นี้

**ข้อดี:** ถ้าจะเพิ่มเส้นที่ 4 → แค่ append config ตัวใหม่ ไม่ต้องแก้ component

---

## 📐 Architecture

```
                ┌─────────────────────────┐
                │      LINE_CONFIGS       │  ← จุดเดียวที่เก็บทุก config
                │  (color, label, scale)  │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
  ┌──────────┐         ┌──────────┐         ┌──────────┐
  │  Chart   │         │ Tooltip  │         │  Legend  │
  │  (Lines) │         │ (Values) │         │ (Labels) │
  └──────────┘         └──────────┘         └──────────┘
```

---

## 👨‍💻 ผู้พัฒนา

**ภูริมาศ สุดานิช (Fifa)**
- 📧 Email: [phurimart14@gmail.com]
- 🐙 GitHub: [@phurimart14](https://github.com/phurimart14/devdeva-test-chart)

Frontend Developer · React / TypeScript / Next.js

---

## 📄 License

โปรเจกต์นี้เป็นส่วนหนึ่งของแบบทดสอบ DEVDEVA Frontend Developer