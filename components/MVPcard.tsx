import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query';

export type MvpCard = {
    id: number
    name: string;
    img?: string;
    respawnTime: number;
    lastKillTime: Date;
    isAlive: boolean;
};

interface MvpProps {
    cards: MvpCard[];
}

const updateMvpInfo = async ({
    mvpId,
    lastKillTime,
    alive,
    respawnTime
}: {
    mvpId: number,
    lastKillTime: Date,
    alive: boolean,
    respawnTime: number
}) => {
    const updatedData = await fetch("http://localhost:3000/api/mvp", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: mvpId,
            isAlive: alive,
            respawnTime: respawnTime,
            lastKillTime: lastKillTime
        }),
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
        const currentMvp = cards.find((card) => card.id === id)
        console.log(currentMvp)

        if (!currentMvp) return
        const currentTime = new Date()

        const lastKillTime = new Date(currentMvp.lastKillTime);
        const difference = currentMvp.respawnTime * 1000 + lastKillTime.getTime();
        const differenceDate = new Date(difference).toLocaleTimeString([],
            { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const resp = currentMvp.respawnTime

        if (currentMvp.isAlive) {
            const alive = !currentMvp.isAlive;
            const res = await mutateAsync({
                mvpId: id,
                alive: alive,
                lastKillTime: currentTime,
                respawnTime: resp,
            });
            queryClient.invalidateQueries(["mvplist"]);
            console.log(res, "results")

        } else {
            alert(currentMvp.name + " is dead")
        }

        console.log(differenceDate, "respawn")
        console.log(currentTime, "lastkilltime")


    };


    cards.forEach((card) => {
        const currentTime = new Date();
        const lastKillTime = new Date(card.lastKillTime);
        const deadToAlive = card.respawnTime * 1000 + lastKillTime.getTime() === currentTime.getTime();

        if (deadToAlive && !card.isAlive) {
            
            mutateAsync({
                mvpId: card.id,
                alive: true,
                lastKillTime: card.lastKillTime,
                respawnTime: card.respawnTime
            });
            queryClient.invalidateQueries(["mvplist"]);
        }
    });


    // console.log(data, "data")

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error has occurred</div>;

    return (
        <div className="flex justify-center items-center gap-10 flex-wrap">
            {cards.map((card, index) => {
                const lastKillTime = new Date(card.lastKillTime);

                const difference = card.respawnTime * 1000 + lastKillTime.getTime();
                const differenceDate = new Date(difference).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                return (
                    <div key={index} className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px]">
                        <span>{card.name}</span>
                        <span>
                            <img className="custom-height" src={card.img} alt="" height="100px" />
                        </span>
                        <span className={`${card.isAlive ? 'text-green-700' : 'text-red-700'}`}>
                            {card.isAlive ? 'alive' : 'dead'}
                        </span>

                        <span>{differenceDate}</span>
                        <button onClick={() => handleMvpUpdate(card.id)} className="bg-red-700 w-full text-white py-1">killed</button>
                        <button className="bg-[#A27B5C] w-full text-white py-1">edit</button>
                    </div>
                );
            })}
        </div>
    );
};

export default MVPcard;



