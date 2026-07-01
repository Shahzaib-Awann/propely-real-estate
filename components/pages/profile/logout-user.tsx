"use client"

import { useState } from "react"
import { socket } from "@/lib/socket/client"
import { SOCKET_EVENTS } from "@/lib/socket/socket-events"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { handleSignOutAction } from "@/lib/actions/auth"

interface LogoutUserProps {
  userId?: number
}

const LogoutUser = ({ userId }: LogoutUserProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Handles full logout lifecycle
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingOut(true)

    try {

      // If user is authenticated, clean up socket presence first
      if (userId) {

        // Notify server to unregister user from online tracking
        socket.emit(SOCKET_EVENTS.UNREGISTER_USER, userId);

        // Disconnect socket to trigger server-side disconnect cleanup
        socket.disconnect();
      }

    } catch (error) {
      console.error("Failed to cleanly disconnect socket presence:", error)
    } finally {
      // Complete authentication logout and redirect flow
      await handleSignOutAction()
    }
  }

  return (
    <form onSubmit={handleLogout}>
      <Button
        type="submit"
        disabled={isLoggingOut}
        className="w-fit px-10 h-12 text-base rounded-none font-lato font-semibold tracking-wide transition-all"
      >
        {isLoggingOut ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing out...
          </div>
        ) : (
          "Logout"
        )}
      </Button>
    </form>
  )
}

export default LogoutUser