import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[576px_1fr] box-border items-center justify-center min-h-screen md:p-8 font-[family-name:var(--font-geist-sans)] bg-[url('/hkust.jpg')] bg-cover">
      <main className="flex flex-col gap-8 items-start justify-items-center justify-center h-full p-8 sm:p-20 md:rounded-lg bg-white/75 dark:bg-black/75 backdrop-blur-lg md:shadow-2xl">
        <p className="text-6xl font-bold text-black dark:text-white text-start">Log in</p>
        <p className="text-2xl text-black dark:text-white text-start">to control your Virtual Window</p>

        <form>
          <div className="flex gap-4 items-start flex-col">
            <input className="rounded px-2 py-1 border border-black dark:border-white text-black" type="text" id="email" name="email" placeholder="Email address"></input>
            <input className="rounded px-2 py-1 border border-black dark:border-white text-black" type="password" id="password" name="password" placeholder="Password"></input>
          </div>
        </form>

        <div className="flex gap-4 items-start flex-row">
          <a
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:opacity-75 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            rel="noopener noreferrer"
          >
            Register
          </a>
          <a
            className="rounded-full border border-hkust-gold transition-colors flex items-center justify-center bg-hkust-gold text-background gap-2 hover:opacity-75 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            rel="noopener noreferrer"
          >
            Log in
          </a>
        </div>
      </main>
    </div>
  );
}
