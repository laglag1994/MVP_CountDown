


export type MvpCard = {
    name: string
    img?: string
    time?: string
}

interface MvpProps {
    cards: MvpCard[]
}

const MVPcard: React.FC<MvpProps> = ({ cards }) => {
    return (
        <div className="flex justify-center items-center gap-10 flex-wrap ">
            {cards.map((card, index) => (
                <div key={index}
                className="flex flex-col justify-center items-center border-2 bg-[#DCD7C9] border-[#A27B5C] w-[200px] " 
                >
                    <span>{card.name}</span>
                    <span><img 
                    className="custom-height"
                    src={card.img} alt="" height="100px"/></span>
                    <span>{card.time}</span>
                    <button className="bg-red-700 w-full text-white py-1">killed</button>
                    <button className="bg-[#A27B5C] w-full text-white py-1">edit</button>
                </div>
            ))}
        </div>
    )
}


export default MVPcard