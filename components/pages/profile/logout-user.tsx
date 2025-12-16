import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"



const LogoutUser = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button
        type="submit"
        className="w-fit px-10 h-12 text-base rounded-none"
      >
        Logout
      </Button>
    </form>
  )
}

export default LogoutUser
