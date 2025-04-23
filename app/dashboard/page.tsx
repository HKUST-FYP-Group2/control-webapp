'use client';

import { 
  PowerIcon, 
  PhotoIcon,
  MusicalNoteIcon,
  MapPinIcon,
  PlayIcon,
  SunIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { apiAddress } from '../globals';
import { socket } from '../socket';
import { io } from 'socket.io-client';

export const fetchCache = 'force-no-store';

const projectorEntryLinkTagStyle = "w-full md:w-72"

const projectorEntryStyle = "flex flex-col w-full md:w-72 rounded-md p-4 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

const projectorNameStyle = "text-2xl font-bold leading-10";

const projectorStatusRowStyle = "flex flex-row items-center gap-1";

const projectorStatusIconStyle = "h-4";

export default function Page() {
  const [cookies, setCookie] = useCookies(['controlAppToken']);

  // Projectors
  const [projectors, setProjectors] = useState([] as any[]);
  const projectorTiles = projectors.map(projector => 
    <Link key={projector?.device_uuid} className={projectorEntryLinkTagStyle} href={{
      pathname: "/dashboard/menu",
      query: {
        targetPjtUuid: projector?.device_uuid
      }
      }}>
      <div className={projectorEntryStyle}>
        {/* Projector name (UUID) */}
        <h2 className={projectorNameStyle}>{projector?.device_uuid.split("-")[0]}</h2>

        {/* Current playing video */}
        <div className={projectorStatusRowStyle}>
          <PlayIcon className={projectorStatusIconStyle} />
          <p className="truncate">{projector?.settings?.video?.show_video ? projector?.settings?.video?.video_url.split("/").slice(-1) : "Video Off"}</p>
        </div>
        
        {/* Current playing audio */}
        <div className={projectorStatusRowStyle}>
          <SpeakerWaveIcon className={projectorStatusIconStyle} />
          <p>
            {
              projector?.settings?.sound?.mode === "original" ?
              "Original" :
              (
                projector?.settings?.sound?.keywords.join(", ") === "" ?
                "Audio Off" :
                projector?.settings?.sound?.keywords.join(", ")
              )
            }
          </p>
        </div>
        
        {/* Brightness */}
        <div className={projectorStatusRowStyle}>
          <SunIcon className={projectorStatusIconStyle} />
          <p>{projector?.settings?.brightness || 0}</p>
        </div>
      </div>
    </Link>
  );

  // const connectWebSocket = () => {
  //   setWs(webSocket(apiAddress));
  // }

  // const initWebSocket = () => {
  //   ws.on("SyncSetting", data => {
  //     setSettings(data.room)
  //   })
  // }

  useEffect(() => {
    console.log("Dashboard: Fetching status");  // DEBUG PRINT

    fetch(apiAddress + "/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.controlAppToken
      }
    })
      .then(response => {
        if (response?.ok) {
          console.log("Dashboard: Fetched status");  // DEBUG PRINT

          response?.json()
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

              socket.off('connect').on('connect', () => {
                console.log("Dashboard: Connected to WebSocket");  // DEBUG PRINT

                socket.emit("SyncSetting", {
                  user_id: data?.user_id,
                  device_type: "Control",
                  msg: "GetSetting"
                });
              });

              socket.off("SyncSetting").on("SyncSetting", (pjtSettings) => {
                try {
                  console.log("Dashboard: SyncSetting message received:", pjtSettings);  // DEBUG PRINT

                  // Function to find index of projector in projectors list
                  const isSameUuid = (elem: any) => (elem?.device_uuid === pjtSettings?.device_uuid) && (pjtSettings?.device_uuid !== undefined)

                  // Check if message is from user's projector
                  if (pjtSettings?.user_id === data?.user_id) {
                    if (pjtSettings?.msg === "UpdateProjectorAppSetting") {
                      // Find if projector is already on projectors list
                      const foundPjtIndex = projectors.findIndex(isSameUuid);
                      if (foundPjtIndex !== -1) {  
                        // If projector is already on projectors list, update it
                        const newProjectors = projectors.map((c, i) => {
                          if (i === foundPjtIndex) {
                            return pjtSettings;
                          } else {
                            return c;
                          }
                        });
                        setProjectors(newProjectors);
                      } else {
                        // If projector is not already on projectors list, append it
                        setProjectors(
                          [
                            ...projectors,
                            pjtSettings
                          ]
                        );
                      }
                    } else if (pjtSettings?.msg === "Logout") {
                      // Remove projector from projectors list
                      setProjectors(
                        projectors.filter(elem =>
                          isSameUuid(elem)
                        )
                      );
                    }
                  }
                } catch (err) {
                  alert(pjtSettings);
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
        } else {
          response?.json().then(data => console.log(data));  // DEBUG PRINT
        }
      })
      .catch((err) => {
        console.log(`Error fetching status: ${err}`);
      });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Projectors</h1>
      <p>You can control projectors signed in to your account.</p>
      <div className="flex flex-col md:flex-row items-start flex-wrap gap-3">
        {/* <Link className={projectorEntryLinkTagStyle} href="/dashboard/menu">
          <div className={projectorEntryStyle}>
            <h2 className={projectorNameStyle}>Gibson's Projector</h2>
            <div className={projectorStatusRowStyle}>
              <PowerIcon className="h-4 text-green-600 dark:text-green-400" />
              <p>On</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <MapPinIcon className={projectorStatusIconStyle} />
              <p>Room 2407</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <PhotoIcon className={projectorStatusIconStyle} />
              <p>HKUST From Above</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <MusicalNoteIcon className={projectorStatusIconStyle} />
              <p>Ocean Waves</p>
            </div>
          </div>
        </Link>

        <Link className={projectorEntryLinkTagStyle} href="/dashboard/menu">
          <div className={projectorEntryStyle}>
            <h2 className={projectorNameStyle}>Classroom Projector</h2>
            <div className={projectorStatusRowStyle}>
              <PowerIcon className="h-4 text-red-600 dark:text-red-400" />
              <p>Off</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <MapPinIcon className={projectorStatusIconStyle} />
              <p>Room 4096</p>
            </div>
          </div>
        </Link>

        <div className={projectorEntryStyle}>
          <h2>Device 3</h2>
        </div>

        <div className={projectorEntryStyle}>
          <h2>Device 4</h2>
        </div>

        <Link className={projectorEntryLinkTagStyle} href="/dashboard/menu">
          <div className={projectorEntryStyle}>
            <h2 className={projectorNameStyle}>Classroom Projector</h2>
            <div className={projectorStatusRowStyle}>
              <PowerIcon className="h-4 text-green-600 dark:text-green-400" />
              <p>On</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <MapPinIcon className={projectorStatusIconStyle} />
              <p>Room 4096</p>
            </div>
            <div className={projectorStatusRowStyle}>
              <p>0</p>
            </div>
          </div>
        </Link> */}

        {projectorTiles}
      </div>
    </div>
  );
}
