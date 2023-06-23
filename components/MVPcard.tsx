import { data } from "autoprefixer"
import { useState } from "react"
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from 'react-query'



export type MvpCard = {
    name: string
    img?: string
    respawnTime?: string
    isAlive: boolean
}

interface MvpProps {
    cards: MvpCard[]
}

const shortTime = respawnTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });


const MVPcard: React.FC<MvpProps> = ({ cards }) => {




    const queryClient = useQueryClient()

    const {
        isLoading,
        error,
        data,
        mutateAsync,
    } = useMutation(
        "updateMvp", async ({ mvpId, respTime, isDead }: { mvpId: number, respTime: Date, isDead: Boolean }) => {
            const updatedData = await fetch("http://localhost:3000/api/mvp", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: mvpId, isAlive: isDead, respawnTime: respTime }),
            });
            return updatedData.json();
        }
    );

    const handleMvpUpdate = async (id: number) => {
        const respTime = new Date();
        const isDead = false;
        const res = await mutateAsync({
            mvpId: id,
            isDead,
            respTime
        });
        queryClient.invalidateQueries(["mvplist"])
    };





    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>An error has occurred</div>;


    console.log(data)
    return (
        <div className="flex justify-center items-center gap-10 flex-wrap ">
            {cards.map((card, index) => (
                <div key={index}
                    className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px] "
                >
                    <span>{card.name}</span>
                    <span><img
                        className="custom-height"
                        src={card.img} alt="" height="100px" /></span>
                    <span>{card.isAlive ? "alive" : "dead"}</span>
                    <span>{card.respawnTime}</span>
                    <button
                        onClick={() => handleMvpUpdate(index)}
                        className="bg-red-700 w-full text-white py-1">killed</button>
                    <button className="bg-[#A27B5C] w-full text-white py-1">edit</button>
                </div>
            ))}
        </div>
    )
}


export default MVPcard