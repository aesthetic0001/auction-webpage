import Card from "@/components/Card";
import Image from "next/image";
import {intToString, toDHMS} from "@/utils/number";
import {motion} from "framer-motion";
import {FaRegPauseCircle, FaRegPlayCircle} from "react-icons/fa";
import {useEffect, useRef, useState} from "react";
import {AuctionCard} from "@/components/AuctionCard";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import Convert from "ansi-to-html";

export function AccountCard({username, uuid, startDate, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (<Card className={className}>
        <div className="flex flex-rows items-center justify-stretch gap-5 h-full w-full">
            <Image
                src={`https://mc-heads.net/head/${uuid.replace(/-/g, '').trim()}.png`}
                alt="Minecraft Head"
                className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                width={100}
                height={100}
            />
            <div className="flex flex-col my-3">
                <h2 className="text-md text-gray-400">Welcome Back</h2>
                <h1 className="text-lg text-primary">{username}</h1>
                <h2 className="text-md text-gray-500">{`${toDHMS(elapsed)} elapsed`}</h2>
            </div>
        </div>
    </Card>);
}

export function QuickProfitCard({profit, profitThisHour, startDate, profitThisHourQueue, className}) {
    const elapsed = Math.floor((Date.now() - startDate) / 1000);
    return (<Card className={className}>
        <div className="flex flex-rows items-center justify-stretch gap-5 h-full w-full">
            <Image
                src="/gold_block.png"
                alt="Gold Block"
                className="border-2 border-white/10 shadow-md p-2 rounded-3xl"
                width={100}
                height={100}
            />
            <div className="flex flex-col gap-1 my-3">
                <h1 className="text-lg text-primary">Profit Stats</h1>
                <h2 className="text-sm text-gray-400 hover:text-accent transition-colors duration-200">{`Total Profit: ${intToString(profit)} coins (${intToString(profit * 3600 / Math.max(elapsed, 1))} coins/h)`}</h2>
                <h2 className="text-sm text-gray-400 hover:text-accent transition-colors duration-200">{`Profit This Hour: ${intToString(profitThisHour)} coins`}</h2>
                {/*<h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Profit from Previous Flip: ${intToString(profitThisHourQueue[profitThisHourQueue.length - 1]?.profit || 0)} coins`}</h2>*/}
            </div>
        </div>
    </Card>);
}

export function StateCard({state, purse, className, sendMessage}) {
    return (<Card className={className}>
        <div className="grid grid-cols-4 items-center justify-stretch gap-5 h-full w-full">
            <div className="col-span-3">
                <h1 className="text-lg text-primary">Bot State</h1>
                <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Current State: ${state}`}</h2>
                <h2 className="text-md text-gray-400 hover:text-accent transition-colors duration-200">{`Purse Balance: ${intToString(purse)} coins`}</h2>
            </div>
            <div className="flex flex-col col-span-1 gap-1">
                <motion.button
                    className="flex items-center justify-center bg-error rounded-2xl hover:cursor-pointer w-full aspect-square"
                    onClick={() => {
                        sendMessage(JSON.stringify({
                            type: "CPacketConsoleCommand", data: {
                                command: "pause"
                            }
                        }))
                    }}
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.98
                    }}
                    transition={{
                        scale: {
                            ease: 'easeInOut', duration: 0.1
                        }
                    }}
                >
                    <FaRegPauseCircle className="text-lg"/>
                </motion.button>
                <motion.button
                    className="flex items-center justify-center p-1 bg-secondary rounded-2xl hover:cursor-pointer w-full aspect-square"
                    onClick={() => {
                        sendMessage(JSON.stringify({
                            type: "CPacketConsoleCommand", data: {
                                command: "resume"
                            }
                        }))
                    }}
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.98
                    }}
                    transition={{
                        scale: {
                            ease: 'easeInOut', duration: 0.1
                        }
                    }}
                >
                    <FaRegPlayCircle className="text-lg"/>
                </motion.button>
            </div>
        </div>
    </Card>);
}

export function ChatCard({className, messages, sendMessage}) {
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const [message, setMessage] = useState("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        if (isAutoScroll) scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            const container = messagesContainerRef.current;
            if (!container) return;
            const isAtBottom = Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 5;
            setIsAutoScroll(isAtBottom);
        };
        const container = messagesContainerRef.current;
        container?.addEventListener("scroll", handleScroll);
        return () => {
            container?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSend = () => {
        if (message.trim() === "") return;
        sendMessage(JSON.stringify({
            type: "CPacketConsoleCommand", data: {
                command: message.trim(),
            },
        }));
        setMessage("");
    };

    const convert = useRef(new Convert());

    return (<Card className={className}>
        <div className="flex flex-col h-full gap-1 justify-between">
            <div
                className="flex flex-col gap-1 my-3 text-sm no-scrollbar overflow-y-scroll bg-background p-3 rounded-3xl scroll-smooth"
                ref={messagesContainerRef}
            >
                {messages.map((message, index) => (<div key={index} className="flex flex-row gap-2">
                    {/*<h1 className="text-primary">[{message.sender}]</h1>*/}
                    <h2 className="text-gray-500" dangerouslySetInnerHTML={{__html: convert.current.toHtml(message.message)}}></h2>
                </div>))}
                <div ref={messagesEndRef}/>
            </div>
            <div className="flex flex-row gap-2 justify-center text-md flex-shrink-0">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSend();
                        }
                    }}
                    className="w-full border border-white/10 rounded-2xl px-5 py-2 bg-transparent text-white"
                    placeholder="Enter a command..."
                />
                <button
                    onClick={handleSend}
                    className="bg-secondary text-primary rounded-2xl p-2"
                >
                    Send
                </button>
            </div>
        </div>
    </Card>);
}

export function AuctionsDisplayCard({ auctions, className, sendMessage }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <Card className={className}>
            <div
                ref={scrollRef}
                className="flex flex-row items-center gap-3 h-full w-full overflow-x-scroll no-scrollbar scroll-smooth"
            >
                {Object.keys(auctions).map((auctionID, index) => {
                    const auction = auctions[auctionID];
                    return (
                        <AuctionCard
                            key={index}
                            auction={auction}
                            sendMessage={sendMessage}
                        />
                    );
                })}
            </div>
        </Card>
    );
}

export function GraphCard({data, className}) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) return null;

    const processedData = data.map(entry => ({
        name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Profit: entry.profit
    }));

    return (<Card className={className}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                width={100}
                height={100}
                data={processedData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="Profit"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </Card>);
}
