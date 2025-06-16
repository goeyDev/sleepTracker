"use client"

import { Button } from "@/components/ui/button"
import { logOut } from "../actions"

export function LogOutButton(){
    return(
        <Button  variant="outline" className="px-2 py-1 rounded-md text-sm sm:py-2 font-medium hover:bg-red-600 hover:text-white" onClick={async () => await logOut()}>Log Out</Button>
    )
}