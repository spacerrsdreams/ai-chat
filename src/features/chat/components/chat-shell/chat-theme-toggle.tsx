"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export const ChatThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const triggerIcon =
    !mounted ? (
      <Sun className="size-4 opacity-50" />
    ) : theme === "system" ? (
      <Monitor className="size-4" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="size-4" />
    ) : (
      <Sun className="size-4" />
    )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Theme"
          className="shrink-0"
          size="icon"
          type="button"
          variant="ghost"
        >
          {triggerIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup
          onValueChange={setTheme}
          value={theme ?? "system"}
        >
          <DropdownMenuRadioItem value="light">
            <Sun className="text-muted-foreground" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="text-muted-foreground" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="text-muted-foreground" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
