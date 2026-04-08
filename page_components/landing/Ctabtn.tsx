"use client"

import { SignInButton } from "@clerk/nextjs"
import { MoveRight } from "lucide-react"

export default function Ctabtn() {
  return (
    <div>
      <SignInButton mode="modal">
        
        <button className='flex items-center gap-3 relative overflow-hidden bg-[#111111] text-white rounded-full px-6 py-3 transition-all duration-300 cursor-pointer text-[17px] font-medium group'>
          <span className='relative z-10'>Get Started</span>
          <div className='p-2 bg-white rounded-full'>
            <MoveRight className="text-black" />
          </div>

          <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent'></span>
        </button>
      </SignInButton>
    </div>
  )
}