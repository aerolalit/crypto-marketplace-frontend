"use client";
import { useEffect, useRef } from "react";
import { API_BASE_URL, TELEGRAM_BOT_NAME } from "../constants/config";
import { useAuth } from "../hooks/useAuth";
import styles from '../styles/TelegramLogin.module.css';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

interface TelegramLoginButtonProps {
    onLoginSuccess?: (user: TelegramUser) => void;
}

const TelegramLoginButton = ({ onLoginSuccess }: TelegramLoginButtonProps) => {
    const { isConnected } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Global callback function
        (window as any).onTelegramAuth = (user: TelegramUser) => {
            const token = localStorage.getItem('authToken');
            fetch(`${API_BASE_URL}/auth/telegram`, {
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
                    if (onLoginSuccess) {
                        onLoginSuccess(user);
                    }
                })
                .catch((error) => {
                    console.error("Login failed:", error);
                });
        };

        // Create and append the script element
        if (containerRef.current) {
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-widget.js?7';
            script.setAttribute('data-telegram-login', TELEGRAM_BOT_NAME);
            script.setAttribute('data-size', 'large');
            script.setAttribute('data-radius', '10');
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
            script.setAttribute('data-request-access', 'write');
            script.async = true;

            // Clear the container first
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(script);
        }

        // Cleanup function
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [isConnected, onLoginSuccess]);

    return (
        <div className={styles.telegramLoginContainer}>
            <div ref={containerRef} />
        </div>
    );
};

export default TelegramLoginButton; 