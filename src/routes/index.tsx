import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ระบบจองห้องพักโรงแรม" },
      { name: "description", content: "Visual Dashboard สำหรับจัดการห้องพักโรงแรม 8 ชั้น" },
    ],
  }),
  component: Index,
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
  available: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600",
  occupied: "bg-red-500 hover:bg-red-600 text-white border-red-600",
  reserved: "bg-yellow-400 hover:bg-yellow-500 text-yellow-950 border-yellow-500",
};

const statusLabel: Record<Status, string> = {
  available: "ว่าง",
  occupied: "ไม่ว่าง",
  reserved: "จองแล้ว",
};

function Index() {
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900">🏨 ระบบจัดการห้องพักโรงแรม</h1>
          <p className="text-sm text-slate-500 mt-1">Visual Dashboard — 8 ชั้น · 80 ห้อง</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="ห้องทั้งหมด" value={stats.total} color="text-slate-900" />
          <StatCard label="ห้องว่าง" value={stats.available} color="text-emerald-600" />
          <StatCard label="ห้องไม่ว่าง" value={stats.occupied + stats.reserved} color="text-red-600" />
          <StatCard label="อัตราการเข้าพัก" value={`${stats.occupancy}%`} color="text-indigo-600" />
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
        <div className="flex flex-wrap gap-4 text-sm">
          <LegendDot className="bg-emerald-500" label="ว่าง" />
          <LegendDot className="bg-red-500" label="ไม่ว่าง" />
          <LegendDot className="bg-yellow-400" label="จองแล้ว" />
          <span className="text-slate-500 ml-auto">คลิกห้องเพื่อสลับ ว่าง ↔ ไม่ว่าง · คลิกขวาเพื่อจอง</span>
        </div>

        {/* Floors */}
        <section className="space-y-6">
          {filteredFloors.map(([floor, list]) => {
            const type = list[0].type;
            const price = list[0].price;
            return (
              <div key={floor} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                  <h2 className="text-lg font-semibold text-slate-900">ชั้น {floor}</h2>
                    <p className="text-sm text-slate-500">{type} · ฿{price.toLocaleString()}/คืน</p>
                  </div>
                  <p className="text-xs text-slate-400">{list.length} ห้อง</p>
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
                      className={`aspect-square rounded-lg border-2 font-semibold text-sm flex flex-col items-center justify-center transition-all active:scale-95 ${statusStyles[room.status]}`}
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

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
        active
          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
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
      <span className="text-slate-700">{label}</span>
    </div>
  );
}
