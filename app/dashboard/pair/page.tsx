'use client';

import { useState, Fragment } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { apiAddress } from '@/app/globals';

const pairOptionEntryStyle = "flex flex-col w-full rounded-md p-4 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

const pairOptionNameStyle = "text-2xl font-bold leading-10";

const projIDButtonStyle = "w-max rounded-md bg-neutral-50 dark:bg-neutral-900 p-3 text-sm font-medium hover:opacity-75 shadow-md hover:shadow active:shadow-none md:p-2 md:px-3 duration-200"

// const apiAddress = "https://api.virtualwindow.cam";  // Production
// const apiAddress = "http://127.0.0.1:8000";  // Development

export default function Page() {
  const [cookies, setCookie] = useCookies(['controlAppToken']);

  const [showScanner, setShowScanner] = useState(false);
  const [showIDEntry, setShowIDEntry] = useState(false);

  const router = useRouter();

  function getScanResult(result: IDetectedBarcode[]) {
    const scanBody = JSON.stringify({
      "device_uuid": result[0].rawValue
    })

    alert(result[0].rawValue);

    fetch(apiAddress + "/QRLogin", {
      method: "POST",
      body: scanBody,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.controlAppToken
      }
    })
      .then(response => {
        if (response?.ok) {
          response?.json()
            .then(data => {
              alert("Successfully paired with projector!");
            });
        } else {
          response?.json()
            .then(data => {
              alert("Failed to pair: " + data.error);
            });
        }
      }

      );

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold">Pair a projector</h1>

      {
        showScanner
        ? (
          <Fragment>
            <p>Scan the QR code on the login screen displayed by the projector.</p>
            <Scanner onScan={(result) => getScanResult(result)} components={{finder: false}} />
          </Fragment>
        ) : showIDEntry
        ? (
          <Fragment>
            <p>Enter the projector ID located on the side of the projector.</p>
            <form>
              <input className="rounded px-2 py-1 border border-black dark:border-white  text-black" type="text" id="projID" name="projID" placeholder="Projector ID"></input>
            </form>
            <Link className={projIDButtonStyle} href="/dashboard">
              <button>
                <p>OK</p>
              </button>
            </Link>
          </Fragment>
        )
        : (
          <Fragment>
            <div className={pairOptionEntryStyle} onClick={() => setShowScanner(true)}>
              <h2 className={pairOptionNameStyle}>Scan QR code</h2>
              <p>Scan the QR code on the login screen displayed by the projector.</p>
            </div>
            {/* <div className={pairOptionEntryStyle} onClick={() => setShowIDEntry(true)}>
              <h2 className={pairOptionNameStyle}>Enter projector ID</h2>
              <p>Enter the projector ID located on the side of the projector.</p>
            </div> */}
          </Fragment>
        )
      }
    </div>
  );
}