export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen relative flex items-center justify-center snap-start"
      style={{
        backgroundImage: `url(/images/main-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/60 to-pink-500/60" />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Branding */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow mb-4 tracking-tight">
          KinderPlay
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 drop-shadow">
          Watch us on your favorite platform
        </p>

        {/* Streaming service links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.twitch.tv/kinderplaay"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-purple-700/80 backdrop-blur text-white text-lg font-semibold hover:bg-purple-700 transition-all active:scale-95 drop-shadow"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.07 20.5L7 15.83h-2.07L2.5 21l4.57-1.5 2-2zM21.5 3.25L17.25 0l-4.06 3.25H8.5L4.5 7.5v8.58L9.07 21l2.07-2.83h4.63L21.5 12.3V3.25zM16.83 12.33l-1.56 1.67h-4.7l-2.07 2.83L5.07 15.83V7.5l4-4.25h4.69l3.4 3.4v5.68z" />
            </svg>
            Twitch
          </a>

          <a
            href="https://www.youtube.com/@KinderPlay"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-red-600/80 backdrop-blur text-white text-lg font-semibold hover:bg-red-600 transition-all active:scale-95 drop-shadow"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.6c-1 .3-1.8 1-2.1 2C-.3 7.6-.3 12-.3 12s0 4.4.6 5.8c.3 1 1.1 1.8 2.1 2.1 1.9.6 9.5.6 9.5.6s7.6 0 9.5-.6c1-.3 1.8-1 2-2.1.6-1.4.6-5.8.6-5.8s0-4.4-.6-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
            </svg>
            YouTube
          </a>

          <a
            href="https://vkplay.live/kinderplay"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/20 backdrop-blur text-white text-lg font-semibold hover:bg-white/30 transition-all active:scale-95 drop-shadow"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            VK Play
          </a>
        </div>
      </div>
    </section>
  );
}
