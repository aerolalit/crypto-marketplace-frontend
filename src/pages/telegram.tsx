// components/TelegramLoginButton.tsx
"use client";
import Script from "next/script";
import { useEffect } from "react";
import { TELEGRAM_BOT_NAME } from "../constants/config";
import { useAuth } from "../hooks/useAuth";

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}


const TelegramLoginButton = () => {
    const { isConnected } = useAuth();

    useEffect(() => {
        // Global callback function
        (window as any).onTelegramAuth = (user: TelegramUser) => {
            const token = localStorage.getItem('authToken');
            fetch(`http://localhost:3001/api/auth/telegram`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(user),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Login success:", data);
                })
                .catch((error) => {
                    console.error("Login failed:", error);
                });
        };
    }, [isConnected]);

    return (
        <>
            <Script
                src="https://telegram.org/js/telegram-widget.js?7"
                data-telegram-login={TELEGRAM_BOT_NAME}
                data-size="large"
                data-radius="10"
                data-onauth="onTelegramAuth(user)"
                data-request-access="write"
                async
            />
        </>
    );
};

export default TelegramLoginButton;
