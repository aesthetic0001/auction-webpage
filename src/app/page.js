"use client";

import {useEffect, useState} from "react";
import {ActiveAuctionDisplay, SelectedAuctionContext} from "@/components/AuctionCard";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {produce} from "immer";
import {AccountCard, AuctionsDisplayCard, ChatCard, GraphCard, QuickProfitCard, StateCard} from "@/components/Cards";

function WebsocketIndicator({connected, authKey, websocket, setWebSocket, setAuthKey}) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    // bottom right corner, pinned to the screen
    // also has a small circle that is green if connected, red if not
    // on click: opens a dialog to change the websocket url and auth key
    return <div
        className="absolute bottom-0 left-0 m-4 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-md">
        <button onClick={() => setSettingsOpen(!settingsOpen)} className="flex flex-row items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}/>
            <h1 className="text-sm text-gray-500">{connected ? "Connected" : "Disconnected"}</h1>
        </button>
        {
            settingsOpen && (
                <div className="flex flex-col gap-2 mt-2">
                    <input
                        type="text"
                        value={websocket}
                        onChange={(e) => setWebSocket(e.target.value)}
                        className="border border-white/10 rounded-2xl px-5 py-2 bg-transparent text-white"
                        placeholder="WebSocket URL"
                    />
                    <input
                        type="text"
                        value={authKey}
                        onChange={(e) => setAuthKey(e.target.value)}
                        className="border border-white/10 rounded-2xl px-5 py-2 bg-transparent text-white"
                        placeholder="Auth Key"
                    />
                </div>
            )
        }
    </div>
}

export default function Home() {
    // forces rerenders
    const [tick, setTick] = useState(Date.now());
    const [webSocket, setWebSocket] = useState("ws://localhost:8081");
    const [authKey, setAuthKey] = useState("");
    const [username, setUsername] = useState(null);
    const [uuid, setUuid] = useState(null);
    const [startDate, setStartDate] = useState(Date.now());
    const [profit, setProfit] = useState(0);
    const [profitThisHour, setProfitThisHour] = useState(0);
    const [profitThisHourQueue, setProfitThisHourQueue] = useState([]);
    const [activeAuctions, setActiveAuctions] = useState({
        "98765432-5432-5432-5432-321098765432": {
            name: "Heroic Hyperion",
            uuid: "23456789-2345-2345-2345-234567890123",
            auctionUUID: "98765432-5432-5432-5432-321098765432",
            category: "BOUGHT",
            state: "AWAIT_SELL",
            metadata: {
                starting_bid: 1_600_000_000,
                auction_end: Date.now() + 7200000,
                item_id: "HYPERION",
                profit: 600_000_000,
                profit_percent: 50,
                attributes: {},
                instant_value: [],
                total_time_to_buy: 150,
            },
        },
        "87654321-6543-6543-6543-210987654321": {
            name: "Suspicious Scylla",
            uuid: "34567890-3456-3456-3456-345678901234",
            auctionUUID: "87654321-6543-6543-6543-210987654321",
            category: "BOUGHT",
            state: "AWAIT_SELL",
            metadata: {
                starting_bid: 1_600_000_000,
                auction_end: Date.now() + 3600000,
                item_id: "SCYLLA",
                profit: 600_000_000,
                profit_percent: 50,
                attributes: {},
                instant_value: [],
                total_time_to_buy: 150,
            },
        }
    });
    const [purse, setPurse] = useState(0);
    const [botState, setBotState] = useState("IDLE");
    const [messages, setMessages] = useState([
        {sender: "console", message: "Hello World!"}
    ]);
    const [totalSlots, setTotalSlots] = useState(14);
    const [cacheSize, setCacheSize] = useState(0);

    // cached websocket url and auth key
    useEffect(() => {
        const cachedWebSocket = localStorage.getItem("websocket");
        const cachedAuthKey = localStorage.getItem("authKey");
        if (cachedWebSocket) setWebSocket(cachedWebSocket);
        if (cachedAuthKey) setAuthKey(cachedAuthKey);
    }, [])

    // save websocket url and auth key to local storage
    useEffect(() => {
        localStorage.setItem("websocket", webSocket);
        localStorage.setItem("authKey", authKey)
    }, [webSocket, authKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const {lastMessage, sendMessage, readyState} = useWebSocket(`${webSocket}/?key=${authKey}`, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        onError: (e) => console.log('WebSocket error:', e),
        shouldReconnect: () => true
    });

    function update(data) {
        if (data.username) setUsername(data.username);
        if (data.uuid) setUuid(data.uuid);
        if (data.totalProfit) setProfit(data.totalProfit);
        if (data.profitThisHour) setProfitThisHour(data.profitThisHour);
        if (data.profitThisHourQueue) setProfitThisHourQueue(data.profitThisHourQueue);
        if (data.purse) setPurse(data.purse);
        if (data.state) setBotState(data.state);
        if (data.active) setActiveAuctions(data.active);
        if (data.previousMessages) setMessages(data.previousMessages);
        if (data.start) setStartDate(data.start);
        if (data.tick) setTick(data.tick);
        if (data.totalSlots) setTotalSlots(data.totalSlots);
    }

    useEffect(() => {
        if (lastMessage !== null) {
            const {type, data} = JSON.parse(lastMessage.data);
            switch (type) {
                case "SPacketStats": {
                    update(data);
                    break;
                }
                case 'SPacketStatsUpdate': {
                    update(data);
                    break
                }
                case 'SPacketLog': {
                    setMessages(produce(messages, (draft) => {
                        draft.push({
                            sender: data.sender,
                            message: data.message
                        });
                        while (draft.length > 100) {
                            draft.shift();
                        }
                    }));
                    break;
                }
            }
        }
    }, [lastMessage]);

    return (
        <div className="h-screen p-8 box-border overflow-hidden">
            <SelectedAuctionContext>
                <main className="grid grid-cols-10 grid-rows-10 gap-4 h-full max-h-full">
                    <AccountCard
                        username={username || "aesthetic0001"}
                        uuid={uuid || "04d4147f0bce4f03a8c2b71884680136"}
                        startDate={startDate}
                        tick={tick}
                        className="col-span-2 row-span-2"
                    />
                    <QuickProfitCard
                        profit={profit}
                        profitThisHour={profitThisHour}
                        startDate={startDate}
                        profitThisHourQueue={profitThisHourQueue}
                        className="col-span-2 row-span-2"
                        tick={tick}
                    />
                    <StateCard className="col-span-2 row-span-2" purse={purse} state={botState} tick={tick}
                               activeAuctions={activeAuctions} totalSlots={totalSlots} cacheSize={cacheSize}/>
                    <ChatCard
                        messages={messages}
                        className="col-span-4 row-span-10"
                        sendMessage={sendMessage}
                    />
                    <AuctionsDisplayCard
                        auctions={activeAuctions}
                        className="col-span-6 row-span-3"
                        tick={tick}
                        sendMessage={sendMessage}
                    />
                    <GraphCard
                        data={profitThisHourQueue}
                        className="col-span-6 row-span-5"
                    />
                    <ActiveAuctionDisplay auctions={activeAuctions}/>
                    <WebsocketIndicator connected={readyState === ReadyState.OPEN} websocket={webSocket}
                                        authKey={authKey} setWebSocket={setWebSocket} setAuthKey={setAuthKey}/>
                </main>
            </SelectedAuctionContext>
        </div>
    )
}
