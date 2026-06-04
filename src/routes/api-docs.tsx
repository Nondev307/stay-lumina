import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API Docs — Lumina Hotel" },
      { name: "description", content: "เอกสาร API ของระบบจองห้องพัก Lumina Hotel" },
    ],
  }),
  component: ApiDocs,
});

const endpoints = [
  {
    method: "GET",
    path: "/api/rooms",
    desc: "ดึงรายการห้องพักทั้งหมด พร้อมสถานะปัจจุบัน",
  },
  {
    method: "GET",
    path: "/api/rooms/:id",
    desc: "ดูรายละเอียดของห้องพักรายห้อง",
  },
  {
    method: "POST",
    path: "/api/rooms/:id/checkin",
    desc: "เช็คอินห้อง เปลี่ยนสถานะเป็น ไม่ว่าง",
  },
  {
    method: "POST",
    path: "/api/rooms/:id/reserve",
    desc: "จองห้องล่วงหน้า เปลี่ยนสถานะเป็น จองแล้ว",
  },
  {
    method: "GET",
    path: "/api/stats",
    desc: "สรุปสถิติห้องพักทั้งหมด อัตราการเข้าพัก",
  },
];

const methodColor: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-800",
  POST: "bg-[var(--gold)]/30 text-[var(--forest-deep)]",
  DELETE: "bg-red-100 text-red-700",
};

function ApiDocs() {
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 pt-32 md:pt-36 pb-16 space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Developers</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--forest-deep)] mt-2">
            API Documentation
          </h1>
          <p className="text-[var(--ink-muted)] mt-3 max-w-2xl">
            REST API สำหรับเชื่อมต่อระบบจัดการห้องพักของ Lumina Hotel ใช้ JSON และ HTTPS ทุก endpoint
          </p>
        </div>

        <section className="bg-[var(--forest-deep)] text-[var(--cream)] rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-[var(--gold)]">Base URL</p>
          <code className="block mt-2 font-mono text-lg">https://api.lumina-hotel.com/v1</code>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-[var(--forest-deep)]">Endpoints</h2>
          {endpoints.map((e) => (
            <div
              key={e.path}
              className="bg-white/70 border border-[var(--cream-dark)] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-3"
            >
              <span className={`px-3 py-1 rounded-md font-mono text-xs font-bold w-fit ${methodColor[e.method]}`}>
                {e.method}
              </span>
              <code className="font-mono text-sm text-[var(--forest-deep)] md:min-w-[260px]">
                {e.path}
              </code>
              <p className="text-sm text-[var(--ink-muted)]">{e.desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-serif text-2xl text-[var(--forest-deep)] mb-4">ตัวอย่าง Response</h2>
          <pre className="bg-[var(--forest-deep)] text-[var(--cream)] rounded-2xl p-6 overflow-x-auto text-sm font-mono leading-relaxed">
{`{
  "id": "501",
  "floor": 5,
  "type": "Deluxe Room",
  "price": 2700,
  "status": "available"
}`}
          </pre>
        </section>
      </main>
    </div>
  );
}
