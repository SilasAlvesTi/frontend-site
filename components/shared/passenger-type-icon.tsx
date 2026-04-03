import { User, Users, Baby } from "lucide-react"

interface PassengerTypeIconProps {
  type: string
  className?: string
}

export function PassengerTypeIcon({ type, className = "h-4 w-4" }: PassengerTypeIconProps) {
  if (type === "crianca") return <Users className={className} />
  if (type === "bebe") return <Baby className={className} />
  return <User className={className} />
}