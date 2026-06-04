import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NavBar } from "@/components/NavBar";

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
  { floors: [1, 2], type: "Standard Room", perFloor: 10, price: 900 },
  { floors: [3, 4], type: "Superior Room", perFloor: 10, price: 1500 },
  { floors: [5, 6], type: "Deluxe Room", perFloor: 10, price: 2700 },
  { floors: [7, 8], type: "Premium Room", perFloor: 10, price: 3900 },
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
  available: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
  occupied: "bg-red-500 hover:bg-red-600 text-white border-red-600",
  reserved: "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-500",
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
          ? { ...r, status: r.status === "available" ? "occupied" : r.status === "occupied" ? "available" : r.status }
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

      <main className="max-w-7xl mx-auto px-6 pt-32 md:pt-36 pb-16 space-y-8">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--forest-deep)]">
            จองห้องพัก
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-2">
            ผังห้องพักแบบเรียลไทม์ · 8 ชั้น · 80 ห้อง
          </p>
        </div>

        {/* Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="ห้องทั้งหมด" value={stats.total} />
          <StatCard label="ห้องว่าง" value={stats.available} accent="text-emerald-700" />
          <StatCard label="ห้องไม่ว่าง" value={stats.occupied + stats.reserved} accent="text-red-600" />
          <StatCard label="อัตราการเข้าพัก" value={`${stats.occupancy}%`} accent="text-[var(--gold)]" />
        </section>

        {/* Floor Filter */}
        <section className="flex flex-wrap gap-2">
          <FilterButton label="ทั้งหมด" active={selectedFloor === "all"} onClick={() => setSelectedFloor("all")} />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
            <FilterButton
              key={f}
              label={`ชั้น ${f}`}
              active={selectedFloor === f}
              onClick={() => setSelectedFloor(f)}
            />
          ))}
        </section>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm items-center">
          <LegendDot className="bg-emerald-600" label="ว่าง" />
          <LegendDot className="bg-red-500" label="ไม่ว่าง" />
          <LegendDot className="bg-yellow-400" label="จองแล้ว" />
          <span className="text-[var(--ink-muted)] ml-auto text-xs">
            คลิกห้องเพื่อสลับ ว่าง ↔ ไม่ว่าง · คลิกขวาเพื่อจอง
          </span>
        </div>

        {/* Floors */}
        <section className="space-y-6">
          {filteredFloors.map(([floor, list]) => {
            const type = list[0].type;
            const price = list[0].price;
            return (
              <div key={floor} className="bg-white/70 backdrop-blur rounded-2xl border border-[var(--cream-dark)] p-6">
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-2xl text-[var(--forest-deep)]">ชั้น {floor}</h2>
                    <p className="text-sm text-[var(--ink-muted)]">
                      {type} · <span className="text-[var(--gold)] font-semibold">฿{price.toLocaleString()}</span>/คืน
                    </p>
                  </div>
                  <p className="text-xs text-[var(--ink-muted)]">{list.length} ห้อง</p>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                  {list.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => toggle(room.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setStatus(room.id, room.status === "reserved" ? "available" : "reserved");
                      }}
                      className={`aspect-square rounded-xl border-2 font-semibold text-sm flex flex-col items-center justify-center transition-all active:scale-95 ${statusStyles[room.status]}`}
                      title={`ห้อง ${room.number} — ${statusLabel[room.status]}`}
                    >
                      <span className="text-base">{room.number}</span>
                      <span className="text-[10px] opacity-90 mt-0.5">{statusLabel[room.status]}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl border border-[var(--cream-dark)] p-5">
      <p className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">{label}</p>
      <p className={`text-3xl font-serif mt-2 ${accent ?? "text-[var(--forest-deep)]"}`}>{value}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-[var(--forest-deep)] text-[var(--cream)] border-[var(--forest-deep)]"
          : "bg-white/70 text-[var(--ink)] border-[var(--cream-dark)] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 h-4 rounded ${className}`} />
      <span className="text-[var(--ink)]">{label}</span>
    </div>
  );
}
