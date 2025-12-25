"use client"

import { useParams } from 'next/navigation'


export default function Page() {

    const params = useParams();
    const certificateId = params.id
    return (
        <div>
            {certificateId}
        </div>
    )
}