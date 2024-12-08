// src/components/ui/back-arrow.tsx
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function BackArrow() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-accent rounded-full transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}