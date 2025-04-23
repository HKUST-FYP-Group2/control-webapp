'use client';

import { 
  MapPinIcon,
  SpeakerWaveIcon,
  ChevronRightIcon,
  MusicalNoteIcon,
  SpeakerXMarkIcon,
  SunIcon,
  PowerIcon,
  MoonIcon,
  VideoCameraSlashIcon
} from '@heroicons/react/24/solid';
import { 
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiLightning
} from "rocketicons/wi";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { apiAddress } from '@/app/globals';
import { useCookies } from 'react-cookie';
import { socket } from '@/app/socket';
import Switch from "react-switch";
import ReactPlayer from 'react-player';
import styles from './styles.module.css';

export const fetchCache = 'force-no-store';

const rocketIconStyle = "icon-black dark:icon-white";

const menuStatusStyle = "flex flex-row items-center gap-1";

const menuVideoStyle = "w-full text-2xl font-bold leading-10 bg-inherit text-black dark:text-white";

const iconTextRowStyle = "flex flex-row items-center gap-1";

const sliderIconHeightStyle = "h-6";

const weatherButtonStyle = "flex rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 shadow-md hover:opacity-75 hover:cursor-pointer hover:shadow active:shadow-none duration-200";

const switchRowStyle = "flex flex-row w-full flex-grow content-center place-content-between";

export default function Page() {
  const router = useRouter();

  const [cookies, setCookie] = useCookies(['controlAppToken', 'controlAppStreamKey']);

  // Store settings of target projector
  const [projector, setProjector] = useState({} as any);

  // Get target projector's UUID from parent tile
  const searchParams = useSearchParams();
  const targetPjtUuid = searchParams.get('targetPjtUuid');

  // Store username and user ID
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(-1);

  // Store list of videos
  const [videos, setVideos] = useState<string[]>([]);

  const videoChoices = videos.map((video, index) => 
    <option key={`videoChoice-${video}`} value={`https://virtualwindow.cam/recordings/${cookies['controlAppStreamKey']}/${video}`}>{video}</option>
  );

  const videosWithWeathers = videos.map(video => {
    const videoFilenameSplit = video.split(".")[0].split("-");
    return {
      url: `https://virtualwindow.cam/recordings/${cookies['controlAppStreamKey']}/${video}`,
      weather: videoFilenameSplit[videoFilenameSplit.length - 1]
    };
  });

  // List of options in weather picker
  const weatherChoices = [... new Set(videosWithWeathers.map(entry => entry.weather))].map(weather => <option key={`weather-${weather}`} value={weather}>{weather}</option>);

  // Store thumbnail URL of current playing video
  // const [thumbUrl, setThumbUrl] = useState("");

  // Function to upload new changed settings
  function uploadSettings(newSettings: Object) {
    console.log("Menu: Uploading settings");  // DEBUG PRINT

    socket.emit("SyncSetting", {
      user_id: userId,
      device_type: "Control",
      device_uuid: targetPjtUuid,
      msg: "SetSetting",
      settings: newSettings
    });
  }

  // Function called on brightness slider change
  function brightnessSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting brightness to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      brightness: event.target.value
    };

    uploadSettings(newSettings);
  }

  // Function called on volume slider change
  function volumeSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting volume to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      sound: {
        ...projector.settings.sound,
        volume: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on video change
  function videoChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(`Menu: Setting video to ${event.target.value}`);  // DEBUG PRINT

    if (event.target.value === "Off") {
      const newSettings = {
        ...projector.settings,
        video: {
          ...projector.settings.video,
          show_video: false,
        }
      };
      uploadSettings(newSettings);
    } else {
      const newSettings = {
        ...projector.settings,
        video: {
          show_video: true,
          video_url: event.target.value
        }
      };
      uploadSettings(newSettings);
    }
  }

  // Function called on weather change
  function weatherChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(`Menu: Setting weather to ${event.target.value}`);  // DEBUG PRINT

    if (event.target.value === "Off") {
      const newSettings = {
        ...projector.settings,
        video: {
          ...projector.settings.video,
          show_video: false,
        }
      };
      uploadSettings(newSettings);
    } else if (event.target.value === "Live") {
      // Edit settings and submit
      const newSettings = {
        ...projector.settings,
        video: {
          show_video: true,
          video_url: `https://virtualwindow.cam/hls/${cookies['controlAppStreamKey']}/index.m3u8`
        }
      };
      uploadSettings(newSettings);
    } else {
      // Pick video from weather
      const videosWithSelectedWeather = videosWithWeathers.filter(entry => 
        entry.weather === event.target.value
      );
      console.log(videosWithSelectedWeather);  // DEBUG PRINT
      const pickedVideoUrl = videosWithSelectedWeather[Math.floor(Math.random() * videosWithSelectedWeather.length)].url;

      // Edit settings and submit
      const newSettings = {
        ...projector.settings,
        video: {
          show_video: true,
          video_url: pickedVideoUrl
        }
      };
      uploadSettings(newSettings);
    }
  }

  // Function called on audio change
  const audioInputRef = useRef(null);

  function audioChange() {

    // Get inputted keywords
    // @ts-ignore
    var keywordList = audioInputRef.current.value.split(", ") || [""];
    var keywordQuery = keywordList.join(" AND ");

    // Search for audio with keywords
    console.log(`Searching for audio with query ${keywordQuery}`);  // DEBUG PRINT

    const freesoundApiKey = "tNF2tKLnnGlGt15qih4C4NpjjLKQtbEjPeXaGME6";
    fetch(
      `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(keywordQuery)}&fields=id,name,previews,duration,username,url&page_size=15&filter=duration:[1 TO 120]`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${freesoundApiKey}`
        }
      }
    )
      .then(response => {
        if (response?.ok) {
          response.json()
            .then(data => {
              if (data?.count > 0 && data?.results.length > 0) {
                // Select a random sound from the results
                const randomIndex = Math.floor(
                  Math.random() * Math.min(data?.results.length, 10),
                );
                const selectedSound = data?.results[randomIndex];
                const soundUrl = selectedSound.previews["preview-hq-mp3"];

                // Update the settings
                const newSettings = {
                  ...projector.settings,
                  sound: {
                    ...projector.settings.sound,
                    mode: "auto",
                    sound_url: soundUrl,
                    keywords: keywordList
                  }
                };
            
                uploadSettings(newSettings);

                // Reset the text field
                // @ts-ignore
                audioInputRef.current.value = "";
              }
            });
        }
      })
      .catch(err => {
        console.log(`Failed to fetch audio: ${err}`);  // DEBUG PRINT
      });
  }

  // Set audio via URL
  function changeAudioDirectly() {
    const newSettings = {
      ...projector.settings,
      sound: {
        ...projector.settings.sound,
        mode: "manual",
        // @ts-ignore
        sound_url: audioInputRef.current.value
      }
    };

    uploadSettings(newSettings);

    // Reset the text field
    // @ts-ignore
    audioInputRef.current.value = "";
  }

  // Switch to original audio
  function changeToOriginalAudio() {
    // Update the settings
    const newSettings = {
      ...projector.settings,
      sound: {
        ...projector.settings.sound,
        mode: "original",
        // sound_url: "",
        keywords: [""]
      }
    };

    uploadSettings(newSettings);

    // Reset the text field
    // @ts-ignore
    audioInputRef.current.value = "";
  }

  // Function called on show clock change
  function toggleClock(checked: any) {
    // Update the settings
    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        show_clock: checked
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on show second change
  function toggleShowSecond(checked: any) {
    // Update the settings
    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        show_second: checked
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on 12 hour format change
  function toggleHour12(checked: any) {
    // Update the settings
    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        hour_12: checked
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on font size slider change
  function fontSizeSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting clock font size to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        font_size: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on clock font color change
  function fontColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting clock font color to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        font_color: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on font color change
  function clockBgColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting clock background color to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      clock: {
        ...projector.settings.clock,
        background_color: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on show settings bar change
  function toggleSettingsBar(checked: any) {
    // Update the settings
    const newSettings = {
      ...projector.settings,
      settings_bar: {
        ...projector.settings.settings_bar,
        show_settings_bar: checked
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on settings bar default color change
  function settingsBarDefaultColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting settings bar default color to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      settings_bar: {
        ...projector.settings.settings_bar,
        default_color: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on settings bar hover background color change
  function settingsBarHoverBackgroundColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting settings bar hover background color to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      settings_bar: {
        ...projector.settings.settings_bar,
        hover_background_color: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

  // Function called on settings bar hover icon color change
  function settingsBarHoverIconColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(`Menu: Setting settings bar hover icon color to ${event.target.value}`);  // DEBUG PRINT

    const newSettings = {
      ...projector.settings,
      settings_bar: {
        ...projector.settings.settings_bar,
        hover_icon_color: event.target.value
      }
    };

    uploadSettings(newSettings);
  }

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

              // Store user ID into page
              setUsername(data?.username);
              setUserId(data?.user_id);

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

    // Get list of videos
    const videosBody = JSON.stringify({
      stream_key: cookies['controlAppStreamKey']
    });

    fetch(apiAddress + "/videos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + cookies.controlAppToken
      },
      // body: videosBody
    })
      .then(response => {
        if (response?.ok) {
          response.json()
            .then(data => {
              console.log("Menu: Fetched videos", data);  // DEBUG PRINT
              setVideos(data.videos);
            });
        }
      })
      .catch(err => {
        console.log(`Error fetching videos: ${err}`);
      });
  }, [projector?.settings?.video?.show_video, projector?.settings?.video?.video_url]);

  // Get thumbnail from currently playing video
  // useEffect(() => {
  //   if ((projector?.settings?.video?.video_url || null) !== null) {
  //     console.log(`Loading thumbnail from video ${projector?.settings?.video?.video_url}`)
  //     generateVideoThumbnailViaUrl(projector?.settings?.video?.video_url, 1)
  //       .then((thumbnail) => {
  //         console.log(`Thumbnail found: ${thumbnail}`);
  //         setThumbUrl(thumbnail);
  //       })
  //       .catch(err => {
  //         console.log(`Failed to load thumbnail from video ${projector?.settings?.video?.video_url}`, err);
  //       });
  //   }
  // }, [projector?.settings?.video?.video_url])

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

      {/* <div className="bg-[url('/hkust.jpg')] bg-cover rounded-xl">
        <video key={`projectorPreview_${projector?.settings?.video?.video_url}`} autoPlay muted loop className={"h-[50svh] w-full rounded-xl object-cover"}>
          <source src={projector?.settings?.video?.video_url !== "" ? projector?.settings?.video?.video_url : null}></source>
        </video>
      </div> */}
      <ReactPlayer style={{'opacity': projector?.settings?.video?.show_video ? 1 : 0} as React.CSSProperties} className="video-preview" width="100%" height="auto" playing={projector?.settings?.video?.show_video} muted loop url={projector?.settings?.video?.video_url} />

      <div className="flex flex-col gap-2">
        {/* Video */}
        <div className={menuStatusStyle}>
          {/* <Link href="menu/selectmedia" className={menuVideoStyle}>{projector?.settings?.video?.show_video ? projector?.settings?.video?.video_url.split("/").slice(-1) : "Video Off"}</Link> */}
          <select className={menuVideoStyle} key={`videoSelect-${projector?.settings?.video?.show_video ? projector?.settings?.video?.video_url.split("/").slice(-1) : "Video Off"}`} defaultValue="-1" name="videoSelect" id="videoSelect" onChange={weatherChange}>
            <option disabled value="-1">{projector?.settings?.video?.show_video ? projector?.settings?.video?.video_url.split("/").slice(-1) : "Video Off"}</option>

            <option value="Live">Live</option>

            <option value="Off">Video Off</option>

            {weatherChoices}

            {/* <option value="0">Victoria Harbour</option>
            <option value="1">Mong Kok</option>
            <option value="2">Sea View from HKUST</option> */}
          </select>
          {/* <ChevronRightIcon className="h-4" /> */}
        </div> 

        {/* Audio */}
        <div className={menuStatusStyle}>
          {/* <p>Ocean Waves</p> */}

          {/* <select className="bg-inherit text-black dark:text-white" defaultValue="-1" name="soundSelect" id="soundSelect">
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
          </select> */}

          <div className="flex gap-4 items-start flex-col md:flex-row">
            <div className="flex gap-4 items-center flex-row">
              <MusicalNoteIcon className="h-4" />

              <input className="rounded bg-white dark:bg-black text-black dark:text-white" type="text" id="audioInput" name="audioInput" ref={audioInputRef} placeholder={
                  projector?.settings?.sound?.mode === "original" ?
                  "Original" :
                  (
                    projector?.settings?.sound?.mode === "manual" ?
                    projector?.settings?.sound?.sound_url :
                    (
                      projector?.settings?.sound?.sound_url === "" ?
                      "Audio Off" :
                      projector?.settings?.sound?.keywords.join(", ")
                    )
                  )
                }
              ></input>
            </div>

            <div className="flex gap-4 items-start flex-row">
              <button onClick={audioChange} className="rounded border px-2 hover:opacity-75 hover:cursor-pointer duration-200">
                Search
              </button>

              <button onClick={changeAudioDirectly} className="rounded border px-2 hover:opacity-75 hover:cursor-pointer duration-200">
                URL
              </button>

              <button onClick={changeToOriginalAudio} className="rounded border px-2 hover:opacity-75 hover:cursor-pointer duration-200">
                Original
              </button>
            </div>
          </div>

          {/* <ChevronRightIcon className="h-4" /> */}
        </div>
      </div>

      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        {/* Volume */}
        <SpeakerXMarkIcon className={sliderIconHeightStyle} />
        <input key={`volumeSlider-${projector?.settings?.sound?.volume || 0}`} type="range" id="volume" name="volume" min="0" max="100" defaultValue={projector?.settings?.sound?.volume || 0} className="w-full" onChange={volumeSliderChange} />
        <SpeakerWaveIcon className={sliderIconHeightStyle} />
      </div>
      {/* Brightness */}
      <div className={iconTextRowStyle + " flex-grow gap-2"}>
        <MoonIcon className={sliderIconHeightStyle} />
        <input key={`brightnessSlider-${projector?.settings?.brightness || 0}`} type="range" id="brightness" name="brightness" min="0" max="100" defaultValue={projector?.settings?.brightness || 0} className="w-full" onChange={brightnessSliderChange} />
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

      {/* Clock customization */}
      <div className="flex flex-col flex-grow gap-3">
        <h2 className="text-2xl font-bold">Clock</h2>

        {/* Show clock */}
        <div className={switchRowStyle}>
          <p>Show clock</p>
          <Switch id="showClockSwitch" uncheckedIcon={false} checkedIcon={false} height={24} width={48} onChange={toggleClock} checked={projector?.settings?.clock?.show_clock || false} />
        </div>

        {/* Show second */}
        <div className={switchRowStyle}>
          <p>Show second</p>
          <Switch id="showSecondSwitch" uncheckedIcon={false} checkedIcon={false} height={24} width={48} onChange={toggleShowSecond} checked={projector?.settings?.clock?.show_second || false} />
        </div>

        {/* Use 12 hour format */}
        <div className={switchRowStyle}>
          <p>12-Hour Format</p>
          <Switch id="use12HSwitch" uncheckedIcon={false} checkedIcon={false} height={24} width={48} onChange={toggleHour12} checked={projector?.settings?.clock?.hour_12 || false} />
        </div>

        {/* Font size */}
        <div className={switchRowStyle + " gap-4"}>
          <p className="whitespace-nowrap">Font size</p>
          <input key={`brightnessSlider-${projector?.settings?.clock?.font_size || 0}`} type="range" id="fontSize" name="fontSize" min="10" max="100" defaultValue={projector?.settings?.clock?.font_size || 0} className="w-full" onChange={fontSizeSliderChange} />
          <p>{projector?.settings?.clock?.font_size || 0}</p>
        </div>

        {/* Font color */}
        <div className={switchRowStyle}>
          <p>Font color</p>
          <input type="color" id="fontColor" name="fontColor" value={projector?.settings?.clock?.font_color || "#000000"} onChange={fontColorChange}></input>
        </div>

        {/* Background color */}
        <div className={switchRowStyle}>
          <p>Background color</p>
          <input type="color" id="clockBgColor" name="clockBgColor" value={projector?.settings?.clock?.background_color || "#000000"} onChange={clockBgColorChange}></input>
        </div>
      </div>

      {/* Settings bar customization */}
      <div className="flex flex-col flex-grow gap-2">
        <h2 className="text-2xl font-bold">Settings Bar</h2>

        {/* Show settings bar */}
        <div className={switchRowStyle}>
          <p>Show Settings Bar</p>
          <Switch id="showSettingsBarSwitch" uncheckedIcon={false} checkedIcon={false} height={24} width={48} onChange={toggleSettingsBar} checked={projector?.settings?.settings_bar?.show_settings_bar || false} />
        </div>

        {/* Default color */}
        <div className={switchRowStyle}>
          <p>Default color</p>
          <input type="color" id="settingsBarDefaultColor" name="settingsBarDefaultColor" value={projector?.settings?.settings_bar?.default_color || "#000000"} onChange={settingsBarDefaultColorChange}></input>
        </div>

        {/* Hover background color */}
        <div className={switchRowStyle}>
          <p>Hover background color</p>
          <input type="color" id="settingsBarHoverBackgroundColor" name="settingsBarHoverBackgroundColor" value={projector?.settings?.settings_bar?.hover_background_color || "#000000"} onChange={settingsBarHoverBackgroundColorChange}></input>
        </div>

        {/* Hover icon color */}
        <div className={switchRowStyle}>
          <p>Hover icon color</p>
          <input type="color" id="settingsBarHoverIconColor" name="settingsBarHoverIconColor" value={projector?.settings?.settings_bar?.hover_icon_color || "#000000"} onChange={settingsBarHoverIconColorChange}></input>
        </div>
      </div>
    </div>
  );
}