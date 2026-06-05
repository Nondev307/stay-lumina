import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BedDouble, Wifi, Bath, Coffee, Wind, Sparkles, Check } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import roomStandard from "@/assets/room-standard.jpg";
import roomSuperior from "@/assets/room-superior.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "จองห้องพัก — Lumina Hotel" },
      { name: "description", content: "ระบบจัดการและจองห้องพัก Lumina Hotel · 8 ชั้น · 80 ห้อง" },
    ],
  }),
  component: Booking,
});

type Status = "available" | "occupied" | "reserved";

interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  price: number;
  status: Status;
}

const FLOORS = [
  { floors: [1, 2], type: "Standard Room", perFloor: 10, price: 900, image: roomStandard },
  { floors: [3, 4], type: "Superior Room", perFloor: 10, price: 1500, image: roomSuperior },
  { floors: [5, 6], type: "Deluxe Room", perFloor: 10, price: 2700, image: roomDeluxe },
  { floors: [7, 8], type: "Premium Room", perFloor: 10, price: 3900, image: roomPremium },
];

const ROOM_TYPES = [
  {
    name: "Standard Room",
    price: 900,
    image: roomStandard,
    floors: "ชั้น 1-2",
    features: [
      { icon: BedDouble, text: "เตียงเดี่ยว / เตียงคู่" },
      { icon: Wifi, text: "Wi-Fi ความเร็วสูง" },
      { icon: Bath, text: "ห้องน้ำส่วนตัว" },
    ],
  },
  {
    name: "Superior Room",
    price: 1500,
    image: roomSuperior,
    floors: "ชั้น 3-4",
    features: [
      { icon: BedDouble, text: "เตียง Queen Size" },
      { icon: Wind, text: "ระเบียงส่วนตัว" },
      { icon: Sparkles, text: "ชุดโซฟาพักผ่อน" },
    ],
  },
  {
    name: "Deluxe Room",
    price: 2700,
    image: roomDeluxe,
    floors: "ชั้น 5-6",
    features: [
      { icon: BedDouble, text: "เตียง King Size" },
      { icon: Coffee, text: "มินิบาร์ & ชา/กาแฟ" },
      { icon: Wind, text: "กระจกเต็มบาน" },
    ],
  },
  {
    name: "Premium Room",
    price: 3900,
    image: roomPremium,
    floors: "ชั้น 7-8",
    features: [
      { icon: BedDouble, text: "King Size พรีเมียม" },
      { icon: Bath, text: "อ่างอาบ & Rain Shower" },
      { icon: Wind, text: "วิวพาโนรามา" },
    ],
  },
];

function buildRooms(): Room[] {
  const rooms: Room[] = [];
  for (const group of FLOORS) {
    for (const floor of group.floors) {
      for (let i = 1; i <= group.perFloor; i++) {
        const num = `${floor}${i.toString().padStart(2, "0")}`;
        rooms.push({
          id: num,
          number: num,
          floor,
          type: group.type,
          price: group.price,
          status: "available",
        });
      }
    }
  }
  return rooms;
}

const statusStyles: Record<Status, string> = {
  available:
    "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-900 border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-200",
  occupied:
    "bg-gradient-to-br from-rose-500 to-rose-700 text-white border-rose-700 hover:shadow-rose-300",
  reserved:
    "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950 border-amber-400 hover:shadow-amber-200",
};

const statusDot: Record<Status, string> = {
  available: "bg-emerald-500",
  occupied: "bg-white",
  reserved: "bg-amber-600",
};

const statusLabel: Record<Status, string> = {
  available: "ว่าง",
  occupied: "ไม่ว่าง",
  reserved: "จองแล้ว",
};

function Booking() {
  const [rooms, setRooms] = useState<Room[]>(() => buildRooms());
  const [selectedFloor, setSelectedFloor] = useState<number | "all">("all");

  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const reserved = rooms.filter((r) => r.status === "reserved").length;
    const occupancy = total ? Math.round(((occupied + reserved) / total) * 100) : 0;
    return { total, available, occupied, reserved, occupancy };
  }, [rooms]);

  const toggle = (id: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status:
                r.status === "available" ? "occupied" : r.status === "occupied" ? "available" : r.status,
            }
          : r,
      ),
    );
  };

  const setStatus = (id: string, status: Status) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const groupedByFloor = useMemo(() => {
    const map = new Map<number, Room[]>();
    for (const r of rooms) {
      if (!map.has(r.floor)) map.set(r.floor, []);
      map.get(r.floor)!.push(r);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [rooms]);

  const filteredFloors = useMemo(() => {
    if (selectedFloor === "all") return groupedByFloor;
    return groupedByFloor.filter(([floor]) => floor === selectedFloor);
  }, [groupedByFloor, selectedFloor]);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <NavBar />

      {/* Hero */}
      <section className="relative pt-32 md:pt-36 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, var(--gold), transparent 40%), radial-gradient(circle at 80% 100%, var(--forest), transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-4">
              Property Management
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-[var(--forest-deep)] leading-tight">
              เลือกห้องพักของคุณ
            </h1>
            <p className="text-[var(--ink-muted)] mt-5 text-lg">
              ข้อมูลห้องพักแบบ Real-time · 8 ชั้น · 80 ห้อง
            </p>
          </div>

          {/* Summary glass cards */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="ห้องทั้งหมด" value={stats.total} />
            <StatCard label="ห้องว่าง" value={stats.available} accent="text-emerald-700" />
            <StatCard label="ไม่ว่าง / จองแล้ว" value={stats.occupied + stats.reserved} accent="text-rose-700" />
            <StatCard label="อัตราการเข้าพัก" value={`${stats.occupancy}%`} accent="text-[var(--gold)]" />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-20 space-y-14">
        {/* Room Type Cards */}
        <section>
          <SectionHeading kicker="Our Suites" title="ประเภทห้องพัก" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROOM_TYPES.map((t) => (
              <div
                key={t.name}
                className="group bg-white rounded-[20px] overflow-hidden border border-[var(--cream-dark)] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase opacity-80">{t.floors}</p>
                      <h3 className="font-serif text-xl">{t.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-serif text-[var(--forest-deep)]">
                      ฿{t.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[var(--ink-muted)]">/คืน</span>
                  </div>
                  <ul className="space-y-1.5">
                    {t.features.map((f) => (
                      <li key={f.text} className="flex items-center gap-2 text-xs text-[var(--ink)]">
                        <Check className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floor Filter */}
        <section>
          <SectionHeading kicker="Floor Plan" title="แผนผังห้องพัก" />
          <div className="flex flex-wrap gap-2.5 mb-6">
            <FilterButton
              label="ทั้งหมด"
              active={selectedFloor === "all"}
              onClick={() => setSelectedFloor("all")}
            />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
              <FilterButton
                key={f}
                label={`ชั้น ${f}`}
                active={selectedFloor === f}
                onClick={() => setSelectedFloor(f)}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 text-sm items-center mb-6 px-5 py-3.5 rounded-[20px] bg-white/60 backdrop-blur-md border border-white/80">
            <LegendDot className="bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-400" label="ว่าง" />
            <LegendDot className="bg-gradient-to-br from-amber-200 to-amber-300 border-amber-500" label="จองแล้ว" />
            <LegendDot className="bg-gradient-to-br from-rose-500 to-rose-700 border-rose-700" label="ไม่ว่าง" />
            <span className="text-[var(--ink-muted)] ml-auto text-xs hidden md:block">
              คลิก: ว่าง ↔ ไม่ว่าง · คลิกขวา: สลับสถานะจอง
            </span>
          </div>

          {/* Floors */}
          <div className="space-y-5">
            {filteredFloors.map(([floor, list]) => {
              const type = list[0].type;
              const price = list[0].price;
              const floorAvailable = list.filter((r) => r.status === "available").length;
              return (
                <div
                  key={floor}
                  className="bg-white/70 backdrop-blur-md rounded-[20px] border border-white/80 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--forest-deep)] flex items-center justify-center">
                        <span className="font-serif text-[var(--gold)] text-lg">{floor}</span>
                      </div>
                      <div>
                        <h2 className="font-serif text-xl text-[var(--forest-deep)]">ชั้น {floor}</h2>
                        <p className="text-xs text-[var(--ink-muted)]">
                          {type} · <span className="text-[var(--gold)] font-semibold">฿{price.toLocaleString()}</span>/คืน
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--ink-muted)]">ห้องว่าง</p>
                      <p className="font-serif text-lg text-emerald-700">
                        {floorAvailable}<span className="text-[var(--ink-muted)] text-sm">/{list.length}</span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
                    {list.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => toggle(room.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setStatus(room.id, room.status === "reserved" ? "available" : "reserved");
                        }}
                        className={`group/room relative aspect-square rounded-[18px] border font-semibold flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${statusStyles[room.status]}`}
                        title={`ห้อง ${room.number} — ${statusLabel[room.status]}`}
                      >
                        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${statusDot[room.status]}`} />
                        <span className="font-serif text-lg leading-none">{room.number}</span>
                        <span className="text-[9px] uppercase tracking-wider opacity-80 mt-1">
                          {statusLabel[room.status]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--gold)] font-medium mb-2">
        {kicker}
      </p>
      <h2 className="font-serif text-3xl md:text-4xl text-[var(--forest-deep)]">{title}</h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[20px] border border-white/80 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">{label}</p>
      <p className={`text-3xl font-serif mt-2 ${accent ?? "text-[var(--forest-deep)]"}`}>{value}</p>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
        active
          ? "bg-[var(--forest-deep)] text-[var(--cream)] border-[var(--forest-deep)] shadow-lg shadow-[var(--forest-deep)]/20 scale-105"
          : "bg-white/70 backdrop-blur text-[var(--ink)] border-[var(--cream-dark)] hover:bg-white hover:border-[var(--gold)] hover:text-[var(--forest-deep)]"
      }`}
    >
      {label}
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 h-4 rounded-md border ${className}`} />
      <span className="text-[var(--ink)] text-xs">{label}</span>
    </div>
  );
}
