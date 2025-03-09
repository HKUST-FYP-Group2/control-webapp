import { 
  HomeIcon,
  PlusIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

const sidebarEntryStyle = "flex h-[48px] w-16 md:w-full items-center justify-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 md:flex-none md:justify-start md:p-2 md:px-3 duration-200";

const sidebarButtonStyle = "flex flex-row items-center gap-1";

const sidebarIconStyle = "h-4";

const sidebarTextStyle = "hidden md:block";

export default function Sidebar() {
  return (
    <div className="flex width-full md:grow md:w-auto md:relative md:h-svh md:flex-col p-6 md:p-8 space-x-3 md:space-x-0 md:space-y-3 md:justify-between">
      <div className="flex md:flex-col grow space-x-3 md:space-x-0 md:space-y-3 justify-self-stretch">
        <Link className={sidebarEntryStyle} href="/dashboard">
          <button className={sidebarButtonStyle}>
            <HomeIcon className={sidebarIconStyle} />
            <p className={sidebarTextStyle}>Home</p>
          </button>
        </Link>
        <Link className={sidebarEntryStyle} href="/dashboard/pair">
          <button className={sidebarButtonStyle}>
            <PlusIcon className={sidebarIconStyle} />
            <p className={sidebarTextStyle}>Pair projector</p>
          </button>
        </Link>
      </div>
      <Link className={sidebarEntryStyle} href="/">
        <button className={sidebarButtonStyle}>
          <ArrowLeftStartOnRectangleIcon className={sidebarIconStyle} />
          <p className={sidebarTextStyle}>Sign Out</p>
        </button>
      </Link>
    </div>
  );
}