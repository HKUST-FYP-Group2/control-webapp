"use client";

import { io } from 'socket.io-client';
import { apiAddress } from './globals';

export const socket = io(
    apiAddress,
    // {
    //     autoConnect: false,
    // }
);