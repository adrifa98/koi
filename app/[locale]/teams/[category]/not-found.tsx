import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Team not found</h2>
        <p>Could not find the requested team.</p>
        <Button asChild>
          <Link href="/teams">Return to Teams</Link>
        </Button>
      </div>
    </div>
  )
}

