import { createFileRoute, Link } from "@tanstack/react-router";
import { BedDouble, Building2, Star, Clock, ArrowRight, Sparkles } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import heroRoom from "@/assets/hero-room.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina Hotel — นอนหลับฝันดี ดั่งเมฆนุ่มนวล" },
      {
        name: "description",
        content:
          "โรงแรม Lumina โรงแรมหรูระดับ Luxury กลางเมือง ห้องพัก 80 ห้อง 8 ชั้น พร้อมประสบการณ์การจองที่ง่ายและรวดเร็ว",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { icon: BedDouble, label: "ห้องพักทั้งหมด", value: "80", unit: "ห้อง" },
  { icon: Building2, label: "จำนวนชั้น", value: "8", unit: "ชั้น" },
  { icon: Star, label: "คะแนนรีวิว", value: "4.9", unit: "/ 5.0" },
  { icon: Clock, label: "เปิดบริการ", value: "24", unit: "ชั่วโมง" },
];

function Home() {
  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 md:pt-36 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[var(--cream-dark)] text-xs tracking-[0.2em] uppercase text-[var(--forest)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
              Modern Luxury Hotel
            </div>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] text-[var(--forest-deep)]">
              นอนหลับฝันดี
              <br />
              <span className="italic text-[var(--forest)]">ดั่งเมฆนุ่มนวล</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--ink-muted)] leading-relaxed max-w-lg">
              สัมผัสประสบการณ์การพักผ่อนระดับลักชัวรี่ ท่ามกลางบรรยากาศอันสงบและหรูหรา
              ห้องพักออกแบบอย่างประณีต พร้อมบริการระดับ 5 ดาว ตลอด 24 ชั่วโมง
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--forest-deep)] text-[var(--cream)] font-semibold hover:bg-[var(--forest)] transition"
              >
                จองห้องพักเลย
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-transparent border border-[var(--forest-deep)]/30 text-[var(--forest-deep)] font-semibold hover:bg-white/60 transition"
              >
                ดูห้องพัก
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-[var(--forest-deep)]/20">
              <img
                src={heroRoom}
                alt="Luxury suite at Lumina Hotel"
                width={1024}
                height={1024}
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/30 via-transparent to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 md:-left-10 bg-[var(--cream)] rounded-2xl p-5 shadow-xl border border-[var(--cream-dark)] w-56">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--forest-deep)] flex items-center justify-center">
                  <BedDouble className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <div>
                  <p className="text-2xl font-serif text-[var(--forest-deep)]">80</p>
                  <p className="text-xs text-[var(--ink-muted)]">ห้องพักทั้งหมด</p>
                </div>
              </div>
              <div className="h-px bg-[var(--cream-dark)] my-3" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-muted)]">ชั้น</span>
                <span className="font-semibold text-[var(--forest-deep)]">8 ชั้น</span>
              </div>
            </div>

            <div className="hidden md:block absolute -top-6 -right-6 bg-[var(--gold)] rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-xs uppercase tracking-widest text-[var(--forest-deep)]/70">Rating</p>
              <p className="text-2xl font-serif text-[var(--forest-deep)]">★ 4.9</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group bg-white/70 hover:bg-white border border-[var(--cream-dark)] rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--forest-deep)] flex items-center justify-center mb-4 group-hover:bg-[var(--forest)] transition">
                <s.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                {s.label}
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-serif text-[var(--forest-deep)]">
                  {s.value}
                </span>
                <span className="text-sm text-[var(--ink-muted)]">{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--cream-dark)] bg-[var(--forest-deep)] text-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-xl tracking-[0.2em]">LUMINA <span className="text-[var(--gold)] text-xs">HOTEL</span></p>
            <p className="text-xs text-[var(--cream)]/60 mt-1">Light & Luxury · Since 2025</p>
          </div>
          <p className="text-xs text-[var(--cream)]/60">© 2026 Lumina Hotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
