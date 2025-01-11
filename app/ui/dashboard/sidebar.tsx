import Link from 'next/Link';

export default function Sidebar() {
  return (
    <div className="flex width-full grow md:w-auto md:relative md:h-svh md:flex-col p-4 md:p-8 space-x-3 md:space-x-0 md:space-y-3">
      <Link className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 md:flex-none md:justify-start md:p-2 md:px-3" href="/dashboard">
        <button>
          <p>Home</p>
        </button>
      </Link>
      <Link className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 md:flex-none md:justify-start md:p-2 md:px-3" href="/dashboard/pair">
        <button>
          <p>Pair projector</p>
        </button>
      </Link>
      <Link className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 md:flex-none md:justify-start md:p-2 md:px-3" href="/">
        <button>
          <p>Sign Out</p>
        </button>
      </Link>
    </div>
  );
}