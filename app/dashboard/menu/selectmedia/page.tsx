import { 
  ArrowLeftIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';

const videoSquareStyle = "w-28 h-28 md:w-48 md:h-48 rounded bg-neutral-50 dark:bg-neutral-900 hover:opacity-75 duration-200 bg-[url('/hkust.jpg')] bg-cover";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <Link href="/dashboard/menu">
          <ArrowLeftIcon className="h-6" />
        </Link>
        <h1 className="text-4xl font-bold">Videos</h1>
      </div>

      <div className="flex flex-row flex-wrap gap-2 h-full w-full">
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
        <div className={videoSquareStyle}></div>
      </div>
    </div>
  );
}