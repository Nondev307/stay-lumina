import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/", label: "หน้าแรก" },
  { to: "/booking", label: "จองห้องพัก" },
  { to: "/api-docs", label: "API Docs" },
] as const;

export function NavBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl tracking-[0.2em] font-serif text-[var(--ink)]">
            LUMINA
          </span>
          <span className="text-xs tracking-[0.3em] text-[var(--gold)] font-medium">
            HOTEL
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-md rounded-full p-1.5 border border-[var(--cream-dark)]">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--forest)] text-[var(--cream)] shadow-sm"
                    : "text-[var(--ink)] hover:bg-white/80"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/booking"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--gold)] text-[var(--forest-deep)] text-sm font-semibold hover:opacity-90 transition"
        >
          จองเลย
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex justify-center gap-1 px-4 pb-3">
        {links.map((l) => {
          const active = pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                active
                  ? "bg-[var(--forest)] text-[var(--cream)]"
                  : "bg-white/70 text-[var(--ink)]"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
