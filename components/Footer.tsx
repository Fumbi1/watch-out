'use client'

export default function Footer() {
  return (
    <footer className="relative bg-black text-white py-24 px-8 md:px-16 overflow-hidden">
      {/* Background word */}
      <div 
        className="absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none leading-none"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        <span className="text-[20vw] font-light text-white/[0.02] tracking-tighter">
          ATELIER
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          <div className="space-y-4">
            <h3 
              className="text-2xl font-light tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              ATELIER
            </h3>
            <p className="text-xs text-white/30 font-mono leading-relaxed">
              Crafting precision<br />since 2024
            </p>
          </div>

          {[
            { title: 'Collection', links: ['Aurum', 'Argent', 'Eclipse', 'Bespoke'] },
            { title: 'Studio', links: ['About', 'Craftsmen', 'Atelier', 'Heritage'] },
            { title: 'Connect', links: ['Contact', 'Press', 'Stockists', 'Instagram'] },
          ].map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <h4 className="text-[10px] font-mono tracking-[0.3em] text-white/25 uppercase">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <button className="text-sm text-white/40 hover:text-white transition-colors font-light">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10">
          <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
            © 2026 Atelier Horology — All Rights Reserved
          </p>
          <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
            Swiss Made · Handcrafted · Certified
          </p>
        </div>
      </div>
    </footer>
  )
}