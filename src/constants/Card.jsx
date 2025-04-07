'use client';
import {useRef, useState} from 'react';
import clsx from "clsx";

export default function Card({children, className}) {
    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({x, y});
    };

    const setToMiddle = () => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        setMousePos({x, y});
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={setToMiddle}
            className={
                clsx("relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-md overflow-hidden", className)
            }
        >
            {/* Glass Illumination Layer */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.05), transparent 70%)`,
                }}
            />

            {/* Content */}
            {/*<div className="relative z-10">*/}
            {children}
            {/*</div>*/}
        </div>
    );
}
