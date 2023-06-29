import Image from 'next/image'
import MVPcard from "../../components/MVPcard"
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query'
import { useState } from 'react';



export type mvpTypes = {
  name: string;
  respawnTime: Date
  isAlive: Boolean
  img: String


}

export default function Home() {

  const { isLoading, error, data } = useQuery('mvplist', () =>
    fetch('http://localhost:3000/api/mvp').then(res => res.json()
    )
  )
  
  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error


 

  return (

    <div className='flex flex-col justify-start items-center gap-10 bg-[#2C3639] h-[screen] pb-20'>

      <div className='flex justify-center items-center gap-2 bg-[#3F4E4F] w-full'>
        <img
          className='-translate-x-96 '
          src="/PRM.png" alt="" height={80} width={80} />
        <img src="/mvp2.png" alt="" height={100} width={100} />
        <h1 className='text-4xl text-white'>Timer</h1>
      </div>

      <div className='px-20'>
        <MVPcard cards={data} />
      </div>
    </div>
  )
}
