import { data } from "autoprefixer"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query'



export type MvpCard = {
    name: string
    img?: string
    respawnTime?: Date
    isAlive: boolean
}

interface MvpProps {
    cards: MvpCard[]
}





const MVPcard: React.FC<MvpProps> = ({ cards }) => {



    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        data,
        mutateAsync,
    } = useMutation(
        "updateMvp", async ({ mvpId, respTime, alive }: { mvpId: number, respTime: Date, alive: boolean }) => {
            const updatedData = await fetch("http://localhost:3000/api/mvp", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: mvpId, isAlive: alive, respawnTime: respTime }),
            });
            return updatedData.json();
        }
    );

    const handleMvpUpdate = async (id: number) => {
        const currentMvp = cards[id];
        const currentTime = new Date();
        const respawnTime = new Date(currentTime.getTime() + 90 * 60000); // Add 90 minutes (90 minutes * 60 seconds * 1000 milliseconds)

        if (currentMvp.isAlive) {
            const alive = false;
            const res = await mutateAsync({
                mvpId: id,
                alive,
                respTime: respawnTime,
            });
            queryClient.invalidateQueries(["mvplist"]);
        }
    };





    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>An error has occurred</div>;


    console.log(data)

    const [countdown, setCountdown] = useState<{ hours: number; mins: number; sec: number }>({
        hours: 0,
        mins: 0,
        sec: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            countountdown();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const countountdown = () => {
        const currentTime = new Date();
        cards.forEach((card, index) => {
            if (card.respawnTime) {
                const newRespTime = new Date(card.respawnTime);
                const different = newRespTime.getTime() - currentTime.getTime();



                const hours = Math.floor(different / (1000 * 3600)) % 24;
                const mins = Math.floor(different / (1000 * 60)) % 60;
                const sec = Math.floor(different / 1000) % 60;



                if (index === 0) {
                    setCountdown({ hours, mins, sec });
                    card.isAlive = true
                }
            }
        });
    };



    return (

        <div className="flex justify-center items-center gap-10 flex-wrap ">
            {
                cards.map((card, index) => {
                    // const shortTime = card.respawnTime ? new Date(card.respawnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: "2-digit" }) : '';
                    return (
                        <div key={index} className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px]">
                            <span>{card.name}</span>
                            <span>
                                <img className="custom-height" src={card.img} alt="" height="100px" />
                            </span>
                            <span>{card.isAlive ? "alive" : "dead"}</span>
                            <span>{countdown.hours}: {countdown.mins}: {countdown.sec}</span>
                            <button onClick={() => handleMvpUpdate(index)} className="bg-red-700 w-full text-white py-1">killed</button>
                            <button className="bg-[#A27B5C] w-full text-white py-1">edit</button>
                        </div>
                    );
                })
            }
        </div>
    )
}


export default MVPcard