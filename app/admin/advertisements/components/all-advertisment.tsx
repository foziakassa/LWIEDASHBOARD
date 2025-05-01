'use client'

import fetcher from "@/shared/fecher"
import { Key } from "lucide-react"
import { useEffect, useState } from "react"
type Advertismnet = {
    id: number
    company_name?: string
    email?: string
    phone_number?: string
    product_description?: string
    created_at?: string
    approved?: boolean
  }

export default function AllAdvertisment(){
    const [allAdvertisment , setAllAdvertisment] = useState<Advertismnet[]>([])
    useEffect(()=>{

        async function fetchAdvertisment(){
            try{
                const response = await fetcher('/advertisements')
                setAllAdvertisment(response.data)

            }catch(err){
                console.log("error" , err)

            }
        }

    },[]
)

    return(
        <div className="">
            {allAdvertisment.map((ad:Advertismnet)=>(
                <div className="" key={ad.id}>
                    <h1>{ad.company_name}</h1>
                </div>
            )
                
            )}
        </div>
    )
}


