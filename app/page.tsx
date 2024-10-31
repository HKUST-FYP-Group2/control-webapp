import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-start justify-items-center justify-center min-h-screen p-8 pb-20 sm:p-20 bg-hkust-blue">
        <p className="text-6xl font-bold text-start">Log in</p>
        <p className="text-2xl text-start">to control your Virtual Window</p>

        <form>
          <div className="flex gap-4 items-start flex-col">
            <input className="rounded px-2 py-1" type="text" id="email" name="email" placeholder="Email address"></input>
            <input className="rounded px-2 py-1" type="password" id="password" name="password" placeholder="Password"></input>
          </div>
        </form>

        <div className="flex gap-4 items-start flex-col sm:flex-row">
          <a
            className="rounded border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-white hover:border-transparent hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            rel="noopener noreferrer"
          >
            Register
          </a>
          <a
            className="rounded border border-solid border-transparent transition-colors flex items-center justify-center bg-hkust-gold text-background gap-2 hover:bg-white text-white hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            rel="noopener noreferrer"
          >
            Log in
          </a>
        </div>
      </main>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
