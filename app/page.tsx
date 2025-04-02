'use client';

import Image from "next/image";
import Link from 'next/link';
import { FormEvent } from 'react';
import { redirect } from 'next/navigation';
import { useCookies } from 'react-cookie';
import { apiAddress } from "./globals";

// const apiAddress = "https://api.virtualwindow.cam";  // Production
// const apiAddress = "http://127.0.0.1:8000";  // Development

export default function Home() {
  const [cookies, setCookie] = useCookies(['controlAppToken', 'controlAppStreamKey']);

  async function loginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Compose request body
    const formData = new FormData(event.currentTarget);
    var username: string = formData.get('username')?.toString() || "";
    var password: string = formData.get('password')?.toString() || "";
    const jsonFormData = JSON.stringify({
      username: username,
      password: password
    });
  
    // fetch(apiAddress + '/login', {
    //   method: 'POST',
    //   body: jsonFormData,
    //   headers: {"Content-Type": "application/json"}
    // })
    //   .then(response => response.json())
    //   .then(data => alert(JSON.stringify(data)))
    //   .catch(err => alert(err));

    // Send request
    var response;
    try {
      response = await fetch(apiAddress + '/login', {
        method: 'POST',
        body: jsonFormData,
        headers: {"Content-Type": "application/json"}
      });
    } catch (error) {
      alert("Login error: " + error);
      return;
    }

    // Get response body and status
    var responseBody = await response?.json();
    if (response?.ok) {
      console.log(responseBody);  // DEBUG PRINT
      // Save token to cookies (temporary)
      setCookie('controlAppToken', responseBody.token);
      setCookie('controlAppStreamKey', responseBody.stream_key);
      redirect("/dashboard");
    } else {
      alert(`Failed to login: ${responseBody.error}`);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[576px_1fr] box-border items-center justify-center min-h-svh md:p-8 font-[family-name:var(--font-geist-sans)] bg-[url('/hkust.jpg')] bg-cover">
      <main className="flex flex-col gap-8 box-border items-start justify-items-center justify-center h-full p-8 sm:p-20 md:rounded-lg bg-white/75 dark:bg-black/75 backdrop-blur-lg md:shadow-2xl">
        <p className="text-6xl font-bold text-black dark:text-white text-start">Log in</p>
        <p className="text-2xl text-black dark:text-white text-start">to control your Virtual Window</p>

        <form onSubmit={loginSubmit}>
          <div className="flex gap-4 items-start flex-col">
            <input className="rounded px-2 py-1 border border-black dark:border-white text-black" type="text" id="username" name="username" placeholder="Username"></input>
            <input className="rounded px-2 py-1 border border-black dark:border-white text-black" type="password" id="password" name="password" placeholder="Password"></input>

            <div className="flex gap-4 items-start flex-row">
              <Link
                className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:opacity-75 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 duration-200"
                href="/register"
                rel="noopener noreferrer"
              >
                Register
              </Link>
              <button
                className="rounded-full border border-hkust-gold transition-colors flex items-center justify-center bg-hkust-gold text-background gap-2 hover:opacity-75 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 duration-200"
                type="submit"
              >
                Log in
              </button>
            </div>

          </div>
        </form>

        {/* <div className="flex gap-4 items-start flex-row">
          <Link
            className="rounded-full border border-black dark:border-white transition-colors flex items-center justify-center hover:opacity-75 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 duration-200"
            href="/register"
            rel="noopener noreferrer"
          >
            Register
          </Link>
          <Link
            className="rounded-full border border-hkust-gold transition-colors flex items-center justify-center bg-hkust-gold text-background gap-2 hover:opacity-75 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 duration-200"
            href="/dashboard"
            rel="noopener noreferrer"
          >
            Log in
          </Link>
        </div> */}
      </main>
    </div>
  );
}
