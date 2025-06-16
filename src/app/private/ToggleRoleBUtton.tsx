"use client"


import { toggleRole } from "@/actions/dbActions"
import { Button } from "@/components/ui/button"

export function ToggleRoleButton() {
  return <Button onClick={toggleRole}>Toggle Role</Button>
}