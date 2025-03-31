'use client';

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
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { apiAddress } from '@/app/globals';
import { useCookies } from 'react-cookie';
import { socket } from '@/app/socket';

export const fetchCache = 'force-no-store';

const rocketIconStyle = "icon-black dark:icon-white";

const menuStatusStyle = "flex flex-row w-max items-center gap-1 hover:opacity-75 hover:cursor-pointer duration-200";

const menuVideoStyle = "text-2xl font-bold leading-10 bg-inherit text-black dark:text-white";

const iconTextRowStyle = "flex flex-row items-center gap-1";

const sliderIconHeightStyle = "h-6";

const weatherButtonStyle = "flex rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

export default function Page() {
  const router = useRouter();

  const [cookies, setCookie] = useCookies(['controlAppToken']);

  // Store settings of target projector
  const [projector, setProjector] = useState({} as any);

  // Get target projector's UUID from parent tile
  const searchParams = useSearchParams();
  const targetPjtUuid = searchParams.get('targetPjtUuid');

  useEffect(() => {
    // Check if target projector is set
    if (targetPjtUuid === null) {
      router.push("/dashboard");
    }

    console.log("Menu: Fetching status");  // DEBUG PRINT

    fetch(apiAddress + "/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.controlAppToken
      }
    })
      .then(response => {
        if (response?.ok) {
          console.log("Menu: Fetched status");  // DEBUG PRINT

          response.json()
            .then(data => {
              // Set up socket connection
              // const socket = io(apiAddress, {
              //   transports: ['polling'],
              //   extraHeaders: {
              //     Authorization: "Bearer " + cookies.controlAppToken
              //   }
              // });

              if (socket.io.opts.extraHeaders?.Authorization !== `Bearer ${cookies.controlAppToken}`) {
                socket.io.opts.extraHeaders = {
                  Authorization: "Bearer " + cookies.controlAppToken
                };
                socket.disconnect().connect();
              }

              socket.off("connect").on('connect', () => {
                console.log("Menu: Connected to WebSocket");  // DEBUG PRINT

                socket.emit("SyncSetting", {
                  user_id: data?.user_id,
                  device_type: "Control",
                  msg: "GetSetting"
                });
              });

              socket.off("SyncSetting").on('SyncSetting', (sync) => {
                try {
                  console.log("Menu: SyncSetting message received", sync);  // DEBUG PRINT

                  // Check if message is from user's projectors
                  if (sync?.user_id === data?.user_id) {
                    if (sync?.msg === "UpdateProjectorAppSetting") {
                      // Check if message is from target projector
                      // If it is, update stored projector settings in this page
                      if (sync?.device_uuid === targetPjtUuid) {
                        setProjector(sync);
                      }
                    } else if (sync?.msg === "Logout") {
                      alert("Projector disconnected!");
                      router.push("/dashboard");
                    }
                  }
                  
                } catch (err) {
                  alert(sync);
                }
              });

              socket.off("connect_error").on("connect_error", (err) => {
                console.error(`Error connecting to socket: ${err.message}`);
              });

              socket.emit("SyncSetting", {
                user_id: data?.user_id,
                device_type: "Control",
                msg: "GetSetting"
              });
            });
        }
      })
      .catch(err => {
        console.log(`Error fetching status: ${err}`);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Projector name (UUID) */}
      <h1 className="text-4xl font-bold">{projector?.device_uuid?.split("-")[0]}</h1>

      {/* <div className="flex flex-row items-center justify-between">
        <div className={iconTextRowStyle}>
          <MapPinIcon className="h-4" />
          <p>Room 2407</p>
        </div>
        
        <div className="flex rounded-md p-3 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200">
          <PowerIcon className="h-4" />
        </div>
      </div> */}

      <div className="h-[50svh] w-full rounded-xl bg-[url('/hkust.jpg')] bg-cover"></div>

      <div className="flex flex-col">
        {/* Video */}
        <div className={menuStatusStyle}>
          <Link href="menu/selectmedia" className={menuVideoStyle}>{projector?.settings?.video?.show_video ? projector?.settings?.video?.video_url.split("/").slice(-1) : "Video Off"}</Link>
          {/* <select className={menuVideoStyle} defaultValue="-1" name="videoSelect" id="videoSelect">
            <option value="-1">HKUST From Above</option>
            <option value="0">Victoria Harbour</option>
            <option value="1">Mong Kok</option>
            <option value="2">Sea View from HKUST</option>
          </select> */}
          <ChevronRightIcon className="h-4" />
        </div> 

        {/* Audio */}
        <div className={menuStatusStyle}>
          <MusicalNoteIcon className="h-4" />
          {/* <p>Ocean Waves</p> */}
          <select className="bg-inherit text-black dark:text-white" defaultValue="-1" name="soundSelect" id="soundSelect">
            <option value="-1">
            {
              projector?.settings?.sound?.mode === "original" ?
              "Original" :
              (
                projector?.settings?.sound?.keywords.join(", ") === "" ?
                "Audio Off" :
                projector?.settings?.sound?.keywords.join(", ")
              )
            }
            </option>
            <option value="0">Summer Forest</option>
            <option value="1">Waterfall</option>
            <option value="2">Rainy City</option>
          </select>
          {/* <ChevronRightIcon className="h-4" /> */}
        </div>
      </div>

      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        {/* Volume */}
        <SpeakerXMarkIcon className={sliderIconHeightStyle} />
        <input key={`volumeSlider-${projector?.settings?.sound?.volume || 0}`} type="range" id="volume" name="volume" min="0" max="100" defaultValue={projector?.settings?.sound?.volume || 0} className="w-full" />
        <SpeakerWaveIcon className={sliderIconHeightStyle} />
      </div>
      {/* Brightness */}
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <MoonIcon className={sliderIconHeightStyle} />
        <input key={`brightnessSlider-${projector?.settings?.brightness || 0}`} type="range" id="volume" name="volume" min="0" max="100" defaultValue={projector?.settings?.brightness || 0} className="w-full" />
        <SunIcon className={sliderIconHeightStyle} />
      </div>

      {/* Weather selection */}
      {/* <h2 className="text-2xl font-bold">Weather</h2>
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
      </div> */}
    </div>
  );
}