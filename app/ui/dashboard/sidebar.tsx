'use client';

import { 
  HomeIcon,
  PlusIcon,
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { apiAddress } from '@/app/globals';
import { socket } from '@/app/socket';

const sidebarEntryStyle = "flex h-[48px] w-16 md:w-full items-center justify-center gap-2 rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 md:flex-none md:justify-start md:p-2 md:px-3 duration-200";

const sidebarButtonStyle = "flex flex-row items-center gap-2";

const sidebarIconStyle = "h-4";

const sidebarTextStyle = "hidden md:block";

const usernameRowStyle = "flex flex-row w-16 md:w-full items-center justify-center gap-2 p-3 text-sm md:flex-none md:justify-start md:p-2 md:px-3"

export default function Sidebar() {
  const [cookies, setCookie] = useCookies(['controlAppToken']);

  // Username
  const [username, setUsername] = useState("");

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
              // alert("You are logged in as: " + data?.username);  // DEBUG PRINT
              setUsername(data?.username);

              // if(ws) {
              //   alert('Connected to WebSocket!');
              //   initWebSocket();
              //   ws.emit("SyncSetting", {
              //     user_id: data?.user_id,
              //     device_type: "Control",
              //     msg: "GetSetting"
              //   });
              // }

              // socket.connect();

            });
        } else {
          // alert("You are not logged in!");
          redirect("/");
        }
      })
      // .catch(err => alert(err));
    });

  return (
    <div className="flex w-full md:grow md:w-auto md:relative md:h-svh md:flex-col p-6 md:p-8 space-x-3 md:space-x-0 md:space-y-3 justify-between">
      {/* Align home and pair buttons to top/left */}
      <div className="flex md:flex-col grow space-x-3 md:space-x-0 md:space-y-3 justify-self-stretch">
        {/* Home button (goes to dashboard) */}
        <Link className={sidebarEntryStyle} href="/dashboard">
          <button className={sidebarButtonStyle}>
            <HomeIcon className={sidebarIconStyle} />
            <p className={sidebarTextStyle}>Home</p>
          </button>
        </Link>

        {/* Pair projector button */}
        <Link className={sidebarEntryStyle} href="/dashboard/pair">
          <button className={sidebarButtonStyle}>
            <PlusIcon className={sidebarIconStyle} />
            <p className={sidebarTextStyle}>Pair projector</p>
          </button>
        </Link>
      </div>

      {/* Align username and sign out button to bottom/right */}
      <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 justify-self-end">
        {/* Username */}
        <div className={usernameRowStyle}>
          <UserCircleIcon className={sidebarIconStyle} />
          <p className={sidebarTextStyle}>{username}</p>
        </div>

        {/* Sign out button */}
        <Link className={sidebarEntryStyle} href="/">
          <button className={sidebarButtonStyle}>
            <ArrowLeftStartOnRectangleIcon className={sidebarIconStyle} />
            <p className={sidebarTextStyle}>Sign Out</p>
          </button>
        </Link>
      </div>
      
    </div>
  );
}