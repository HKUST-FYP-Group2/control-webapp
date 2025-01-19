import { 
  MapPinIcon,
  SpeakerWaveIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  SpeakerXMarkIcon,
  SunIcon,
  PowerIcon,
  CloudIcon
} from '@heroicons/react/24/solid';

import { 
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiLightning
} from "rocketicons/wi";

const rocketIconStyle = "icon-black dark:icon-white";

const menuStatusStyle = "flex flex-row w-max items-center gap-1 hover:opacity-75 hover:cursor-pointer duration-200";

const menuVideoStyle = "text-2xl font-bold leading-10";

const iconTextRowStyle = "flex flex-row items-center gap-1";

const sliderIconHeightStyle = "h-6";

const weatherButtonStyle = "flex rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
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
          <h2 className={menuVideoStyle}>HKUST From Above</h2>
          <ChevronRightIcon className="h-4" />
        </div> 
        <div className={menuStatusStyle}>
          <MusicalNoteIcon className="h-4" />
          <p>Ocean Waves</p>
          <ChevronRightIcon className="h-4" />
        </div>
      </div>
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <SpeakerXMarkIcon className={sliderIconHeightStyle} />
        <input type="range" id="volume" name="volume" min="0" max="100" className="w-full" />
        <SpeakerWaveIcon className={sliderIconHeightStyle} />
      </div>
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <SpeakerXMarkIcon className={sliderIconHeightStyle} />
        <input type="range" id="volume" name="volume" min="0" max="100" className="w-full" />
        <SunIcon className={sliderIconHeightStyle} />
      </div>
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