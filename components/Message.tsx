"use client";

import { useState, useEffect } from "react";

type MessageProps = {
    messages: {
        success: string
    }
}

export default function Message({ messages }: MessageProps) {
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!showMessage) return null;

    return (
        <div className="flex items-center justify-center w-full p-2 text-white cursor-pointer message bg-green-600">
            <div className="message font-display">{messages.success}</div>
        </div>
    )
}