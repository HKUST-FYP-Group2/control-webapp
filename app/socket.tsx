"use client";

import { io } from 'socket.io-client';

const apiAddress = "https://api.virtualwindow.cam";  // Production
// const apiAddress = "http://127.0.0.1:8000";  // Development

export const socket = io(
    apiAddress,
    // {
    //     autoConnect: false
    // }
);