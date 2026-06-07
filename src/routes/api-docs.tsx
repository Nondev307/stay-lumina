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

interface Endpoint {
  method: "GET" | "POST" | "DELETE" | "REALTIME";
  path: string;
  title: string;
  desc: string;
  auth: string;
  request?: string;
  response: string;
  notes?: string[];
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/bookings",
    title: "ดึงรายการห้องที่ถูกจองทั้งหมด",
    desc: "คืนรายการห้องทั้งหมดที่มีสถานะ 'ไม่ว่าง' พร้อมชื่อเล่นผู้จอง — ใช้สำหรับซิงค์ floor plan แบบ real-time",
    auth: "Public (ไม่ต้องล็อกอิน)",
    response: `[
  {
    "room_number": "201",
    "nickname": "ปลาวาฬ",
    "created_at": "2026-06-07T10:24:11.832Z"
  },
  {
    "room_number": "508",
    "nickname": "Nana",
    "created_at": "2026-06-07T10:31:45.117Z"
  }
]`,
  },
  {
    method: "POST",
    path: "/bookings/book",
    title: "จองห้องพัก",
    desc: "สร้างการจองห้อง พร้อมบันทึกเบอร์โทรและสร้าง secret สำหรับใช้ยกเลิกในภายหลัง",
    auth: "Public — secret ที่ได้รับจะถูกเก็บใน localStorage ของผู้จอง",
    request: `{
  "room_number": "501",
  "nickname": "ปลาวาฬ",
  "phone": "0812345678"
}`,
    response: `{
  "success": true,
  "secret": "a7d3e9c2-4f81-4a16-9b7e-5c0f1e2d3a4b",
  "room_number": "501"
}`,
    notes: [
      "room_number ต้องเป็นตัวเลข 2–8 หลัก",
      "nickname ความยาว 1–40 ตัวอักษร",
      "phone อนุญาตเฉพาะตัวเลข + - ( ) เว้นวรรค",
      "หากห้องถูกจองแล้วจะคืน error: 'ห้องนี้ถูกจองไปแล้ว'",
    ],
  },
  {
    method: "DELETE",
    path: "/bookings/cancel",
    title: "ยกเลิกการจอง",
    desc: "ยกเลิกการจองห้อง — ต้องส่ง secret ที่ได้ตอนจองเพื่อยืนยันว่าเป็นเจ้าของการจอง",
    auth: "Secret-based (เฉพาะผู้จองเดิมเท่านั้น)",
    request: `{
  "room_number": "501",
  "secret": "a7d3e9c2-4f81-4a16-9b7e-5c0f1e2d3a4b"
}`,
    response: `{
  "success": true
}`,
    notes: [
      "หาก secret ไม่ตรงกับที่บันทึกไว้: 'รหัสยกเลิกไม่ถูกต้อง คุณไม่มีสิทธิ์ยกเลิกการจองนี้'",
      "หากไม่พบห้อง: 'ไม่พบการจองห้องนี้'",
    ],
  },
  {
    method: "GET",
    path: "/rooms",
    title: "ดึงรายการห้องพักทั้งหมด (Static)",
    desc: "ข้อมูลห้อง 80 ห้อง ใน 8 ชั้น พร้อมประเภทและราคา (ข้อมูลคงที่ฝั่ง client)",
    auth: "Public",
    response: `[
  { "number": "101", "floor": 1, "type": "Standard Room", "price": 900 },
  { "number": "301", "floor": 3, "type": "Superior Room", "price": 1500 },
  { "number": "501", "floor": 5, "type": "Deluxe Room",   "price": 2700 },
  { "number": "701", "floor": 7, "type": "Premium Room",  "price": 3900 }
]`,
  },
  {
    method: "GET",
    path: "/stats",
    title: "สรุปสถิติห้องพัก",
    desc: "คืนจำนวนห้องทั้งหมด ห้องว่าง ห้องไม่ว่าง และอัตราการเข้าพัก (คำนวณ client-side จาก /bookings)",
    auth: "Public",
    response: `{
  "total": 80,
  "available": 73,
  "occupied": 7,
  "occupancy": 9
}`,
  },
  {
    method: "REALTIME",
    path: "channel: bookings-realtime",
    title: "Subscribe การเปลี่ยนแปลงห้องพักแบบ Real-time",
    desc: "เชื่อมต่อผ่าน WebSocket เพื่อรับ event INSERT / DELETE ของตาราง bookings ทันทีที่มีคนจองหรือยกเลิก",
    auth: "Public (Supabase Realtime — anon key)",
    request: `supabase
  .channel("bookings-realtime")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "bookings" },
    (payload) => console.log(payload))
  .subscribe();`,
    response: `// INSERT event
{
  "eventType": "INSERT",
  "new": {
    "room_number": "302",
    "nickname": "Mango",
    "created_at": "2026-06-07T10:42:08.221Z"
  }
}

// DELETE event
{
  "eventType": "DELETE",
  "old": { "room_number": "302" }
}`,
  },
];

const methodColor: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-800 border-emerald-300",
  POST: "bg-[var(--gold)]/30 text-[var(--forest-deep)] border-[var(--gold)]/60",
  DELETE: "bg-rose-100 text-rose-700 border-rose-300",
  REALTIME: "bg-indigo-100 text-indigo-700 border-indigo-300",
};

function ApiDocs() {
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <NavBar />

      <main className="max-w-5xl mx-auto px-6 pt-32 md:pt-36 pb-20 space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Developers · v2</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--forest-deep)] mt-2">
            API Documentation
          </h1>
          <p className="text-[var(--ink-muted)] mt-3 max-w-2xl">
            REST + Realtime API ของระบบจองห้องพัก Lumina Hotel — JSON over HTTPS,
            ซิงค์ทันทีระหว่างผู้ใช้ทุกคนผ่าน WebSocket
          </p>
        </div>

        <section className="bg-[var(--forest-deep)] text-[var(--cream)] rounded-2xl p-6 grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--gold)]">Base URL</p>
            <code className="block mt-2 font-mono text-base md:text-lg break-all">
              https://stay-lumina.lovable.app
            </code>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--gold)]">Content-Type</p>
            <code className="block mt-2 font-mono text-base md:text-lg">application/json</code>
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900">
          <p className="font-semibold mb-1">🔐 รูปแบบการยืนยันตัวตน</p>
          <p>
            ระบบไม่ใช้ login — เมื่อจองห้องสำเร็จจะได้ <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">secret</code> กลับมา
            ผู้ที่ถือ secret เท่านั้นจึงจะยกเลิกการจองของห้องนั้นได้
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl text-[var(--forest-deep)]">Endpoints</h2>
          {endpoints.map((e) => (
            <article
              key={e.path}
              className="bg-white/80 backdrop-blur border border-[var(--cream-dark)] rounded-2xl overflow-hidden shadow-sm"
            >
              <header className="px-6 py-4 border-b border-[var(--cream-dark)] flex flex-wrap items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-md font-mono text-xs font-bold border ${methodColor[e.method]}`}
                >
                  {e.method}
                </span>
                <code className="font-mono text-sm text-[var(--forest-deep)] font-semibold">
                  {e.path}
                </code>
              </header>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <h3 className="font-serif text-lg text-[var(--forest-deep)]">{e.title}</h3>
                  <p className="text-sm text-[var(--ink-muted)] mt-1">{e.desc}</p>
                </div>

                <div className="text-xs">
                  <span className="uppercase tracking-widest text-[var(--ink-muted)]">Auth · </span>
                  <span className="text-[var(--ink)]">{e.auth}</span>
                </div>

                {e.request && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-2">
                      Request
                    </p>
                    <pre className="bg-[var(--forest-deep)]/95 text-[var(--cream)] rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed">
{e.request}
                    </pre>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--ink-muted)] mb-2">
                    Response
                  </p>
                  <pre className="bg-[var(--forest-deep)] text-[var(--cream)] rounded-xl p-4 overflow-x-auto text-xs font-mono leading-relaxed">
{e.response}
                  </pre>
                </div>

                {e.notes && e.notes.length > 0 && (
                  <ul className="text-xs text-[var(--ink-muted)] space-y-1 list-disc list-inside">
                    {e.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-[var(--forest-deep)]">Error Format</h2>
          <p className="text-sm text-[var(--ink-muted)]">
            ทุก endpoint ที่ล้มเหลวจะคืนข้อความ error ในรูปแบบเดียวกัน
          </p>
          <pre className="bg-[var(--forest-deep)] text-[var(--cream)] rounded-2xl p-6 overflow-x-auto text-sm font-mono leading-relaxed">
{`{
  "error": "ห้องนี้ถูกจองไปแล้ว",
  "status": 400
}`}
          </pre>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-[var(--forest-deep)]">Status Codes</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              ["200", "สำเร็จ"],
              ["400", "ข้อมูลที่ส่งมาไม่ถูกต้อง (validation)"],
              ["403", "Secret ไม่ตรง — ไม่มีสิทธิ์ยกเลิก"],
              ["404", "ไม่พบข้อมูลห้องหรือการจอง"],
              ["409", "ห้องถูกจองไปแล้ว"],
              ["500", "เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์"],
            ].map(([code, desc]) => (
              <div
                key={code}
                className="flex items-center gap-3 bg-white/70 border border-[var(--cream-dark)] rounded-xl px-4 py-3"
              >
                <code className="font-mono font-bold text-[var(--forest-deep)]">{code}</code>
                <span className="text-[var(--ink-muted)]">{desc}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
