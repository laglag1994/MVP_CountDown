import Image from 'next/image'
import MVPcard, { MvpCard } from "../../components/MVPcard"


export default function Home() {

  const cards: MvpCard[] = [
    {
      name: 'Eddga',
      img: '/eddga.png',
      time: '10:00',
    },
    {
      name: 'Maya',
      img: '/maya.png',
      time: '12:30',
    },
    {
      name: 'drake',
      img: '/drake.png',
      time: '10:00',
    },
    {
      name: 'Maya',
      img: '/maya.png',
      time: '12:30',
    },
  ];

  return (

    <div className='flex flex-col justify-start items-center gap-10 bg-[#2C3639] h-screen'>

      <div className='flex justify-center items-center gap-2 bg-[#3F4E4F] w-full'>
        <img src="/mvp2.png" alt="" height={100} width={100} />
        <h1 className='text-4xl text-white'>Timer</h1>
      </div>

      <div className='px-20'>
        <MVPcard cards={cards} />
      </div>
    </div>
  )
}
