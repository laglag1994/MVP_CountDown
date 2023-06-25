import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';

export type MvpCard = {
    name: string;
    img?: string;
    respawnTime: number;
    lastKillTime?: Date;
    isAlive: boolean;
};

interface MvpProps {
    cards: MvpCard[];
}

const updateMvpInfo = async ({ mvpId, lastKillTime, alive, respDelayTime }: { mvpId: number, lastKillTime: Date, alive: boolean, respDelayTime: number }) => {
    const updatedData = await fetch("http://localhost:3000/api/mvp", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: mvpId, isAlive: alive, respawnTime: respDelayTime, lastKillTime: lastKillTime }),
    });
    return updatedData.json();
};

const MVPcard: React.FC<MvpProps> = ({ cards }) => {
    const queryClient = useQueryClient();

    const { isLoading, error, data, mutateAsync } = useMutation(
        "updateMvp",
        updateMvpInfo
    );

    const handleMvpUpdate = async (id: number) => {
        const currentMvp = cards[id];
        const currentTime = new Date();
        const difference = currentMvp.respawnTime - (currentMvp.lastKillTime instanceof Date ? currentMvp.lastKillTime.getTime() : 0);
        if (currentMvp.isAlive) {
            const alive = false;
            const res = await mutateAsync({
                mvpId: id,
                alive,
                lastKillTime: currentTime,
                respDelayTime: difference,
            });
            queryClient.invalidateQueries(["mvplist"]);
        }
    };
    console.log (data)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error has occurred</div>;

    return (
        <div className="flex justify-center items-center gap-10 flex-wrap">
            {cards.map((card, index) => {
                const timeDifference = card.lastKillTime instanceof Date ? (card.respawnTime - card.lastKillTime.getTime()) : 0;

                return (
                    <div key={index} className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px]">
                        <span>{card.name}</span>
                        <span>
                            <img className="custom-height" src={card.img} alt="" height="100px" />
                        </span>
                        <span>{card.isAlive ? "alive" : "dead"}</span>
                        <span>{timeDifference}</span>
                        <button onClick={() => handleMvpUpdate(index)} className="bg-red-700 w-full text-white py-1">killed</button>
                        <button className="bg-[#A27B5C] w-full text-white py-1">edit</button>
                    </div>
                );
            })}
        </div>
    );
};

export default MVPcard;
