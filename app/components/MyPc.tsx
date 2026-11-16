"use client"

import pcSpecs from "../data/pcSpecs"
import SpriteAnimation from "./SpriteAnimation"

export default function MyPc() {
  return (
    <section
      id="mypc"
      className="min-h-screen relative flex items-center snap-start"
      style={{
        backgroundImage: `url(/images/my-pc-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600/70 to-cyan-500/50" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-4xl">🖥️</span>
          <h2 className="text-4xl font-bold text-white drop-shadow">Мой ПК</h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: PC Specs */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <ul className="space-y-4">
              {pcSpecs.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{spec.icon}</span>
                  <div className="min-w-0">
                    <p className="text-white text-lg font-semibold truncate">{spec.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Sprite Animation */}
          <div className="flex items-center justify-center">
            <SpriteAnimation
              src={["/animations/sprite_open_box_8x6.webp", "/animations/sprite_get_cpu_8x6.webp"]}
              cols={8}
              rows={6}
              fps={60}
              autoPlay
              displayWidth={640}
              displayHeight={640}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
