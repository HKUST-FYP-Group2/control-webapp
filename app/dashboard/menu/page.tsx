import { 
  MapPinIcon,
  SpeakerWaveIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  SpeakerXMarkIcon,
  SunIcon,
  PowerIcon,
  MoonIcon
} from '@heroicons/react/24/solid';
import { 
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiLightning
} from "rocketicons/wi";
import Link from 'next/link';

const rocketIconStyle = "icon-black dark:icon-white";

const menuStatusStyle = "flex flex-row w-max items-center gap-1 hover:opacity-75 hover:cursor-pointer duration-200";

const menuVideoStyle = "text-2xl font-bold leading-10 bg-inherit text-black dark:text-white";

const iconTextRowStyle = "flex flex-row items-center gap-1";

const sliderIconHeightStyle = "h-6";

const weatherButtonStyle = "flex rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Gibson's Projector</h1>
      <div className="flex flex-row items-center justify-between">
        <div className={iconTextRowStyle}>
          <MapPinIcon className="h-4" />
          <p>Room 2407</p>
        </div>
        <div className="flex rounded-md p-3 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200">
          <PowerIcon className="h-4" />
        </div>
      </div>
      <div className="h-[50svh] w-full rounded-xl bg-[url('/hkust.jpg')] bg-cover"></div>
      <div className="flex flex-col">
        <div className={menuStatusStyle}>
          <Link href="menu/selectmedia" className={menuVideoStyle}>HKUST From Above</Link>
          {/* <select className={menuVideoStyle} defaultValue="-1" name="videoSelect" id="videoSelect">
            <option value="-1">HKUST From Above</option>
            <option value="0">Victoria Harbour</option>
            <option value="1">Mong Kok</option>
            <option value="2">Sea View from HKUST</option>
          </select> */}
          <ChevronRightIcon className="h-4" />
        </div> 
        <div className={menuStatusStyle}>
          <MusicalNoteIcon className="h-4" />
          {/* <p>Ocean Waves</p> */}
          <select className="bg-inherit text-black dark:text-white" defaultValue="-1" name="soundSelect" id="soundSelect">
            <option value="-1">Ocean Waves</option>
            <option value="0">Summer Forest</option>
            <option value="1">Waterfall</option>
            <option value="2">Rainy City</option>
          </select>
          {/* <ChevronRightIcon className="h-4" /> */}
        </div>
      </div>
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <SpeakerXMarkIcon className={sliderIconHeightStyle} />
        <input type="range" id="volume" name="volume" min="0" max="100" className="w-full" />
        <SpeakerWaveIcon className={sliderIconHeightStyle} />
      </div>
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <MoonIcon className={sliderIconHeightStyle} />
        <input type="range" id="volume" name="volume" min="0" max="100" className="w-full" />
        <SunIcon className={sliderIconHeightStyle} />
      </div>
      <h2 className="text-2xl font-bold">Weather</h2>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-4 items-center">
          <div className={weatherButtonStyle}>
            <WiDaySunny className={rocketIconStyle + " icon-2xl"} />
          </div>
          <p>Sunny</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className={weatherButtonStyle}>
            <WiCloudy className={rocketIconStyle + " icon-2xl"} />
          </div>
          <p>Cloudy</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className={weatherButtonStyle}>
            <WiRain className={rocketIconStyle + " icon-2xl"} />
          </div>
          <p>Rainy</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className={weatherButtonStyle}>
            <WiLightning className={rocketIconStyle + " icon-2xl"} />
          </div>
          <p>Thunder</p>
        </div>
      </div>
    </div>
  );
}