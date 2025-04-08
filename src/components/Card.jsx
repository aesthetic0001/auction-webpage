'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import clsx from "clsx";

export default function Card({ children, className }) {
    const cardRef = useRef(null);
    const timeoutRef = useRef(null);

    const [isHovering, setIsHovering] = useState(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 300, damping: 40 });
    const springY = useSpring(y, { stiffness: 300, damping: 40 });

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
        clearTimeout(timeoutRef.current);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setToMiddle();
        timeoutRef.current = setTimeout(() => {
            setIsHovering(false);
        }, 200);
    };

    const setToMiddle = () => {
        const rect = cardRef.current.getBoundingClientRect();
        x.set(rect.width / 2);
        y.set(rect.height / 2);
    };

    useEffect(() => {
        setToMiddle();
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const background = useMotionTemplate`
        radial-gradient(400px circle at ${springX}px ${springY}px, rgba(255,255,255,0.05), transparent 70%)
    `;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={clsx(
                "relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-md overflow-hidden",
                className
            )}
        >
            <motion.div
                className="pointer-events-none absolute inset-0"
                style={{ background }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            />
            {children}
        </div>
    );
}
