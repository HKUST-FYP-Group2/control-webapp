'use client';

import { 
  PowerIcon, 
  PhotoIcon,
  MusicalNoteIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useCookies } from 'react-cookie';
import webSocket from 'socket.io-client';
import { Socket } from 'socket.io-client';

const projectorEntryLinkTagStyle = "w-full md:w-72"

const projectorEntryStyle = "flex flex-col w-full md:w-72 rounded-md p-4 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

const projectorNameStyle = "text-2xl font-bold leading-10";

const projectorStatusRowStyle = "flex flex-row items-center gap-1";

const projectorStatusIconStyle = "h-4";

const apiAddress = "https://api.virtualwindow.cam";

export default function Page() {
  const [cookies, setCookie] = useCookies(['controlAppToken']);

  // WebSocket connection to sync projector settings
  const [ws, setWs] = useState({} as Socket);

  const connectWebSocket = () => {
    setWs(webSocket(apiAddress));
  }

  const initWebSocket = () => {
    ws.on("SyncSetting", data => {
      alert(data);
    })
  }

  useEffect(() => {
    fetch(apiAddress + "/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.controlAppToken
      }
    })
      .then(response => {
        if (response?.ok) {
          response?.json()
            .then(data => {
              alert("You are logged in as: " + data?.username)
            });
        } else {
          alert("You are not logged in!");
        }
      })
      .catch(err => alert(err));
    
      if(ws) {
        alert('Connected to WebSocket!')
        initWebSocket()
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Projectors</h1>
      <p>You can control projectors signed in to your account.</p>
      <div className="flex flex-col md:flex-row items-start flex-wrap gap-3">
        <Link className={projectorEntryLinkTagStyle} href="/dashboard/menu">
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
      </div>
    </div>
  );
}
