import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from './button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface NavigationArrowsProps {
  onNext?: () => void
  onPrevious?: () => void
  nextLabel?: string
  previousLabel?: string
  showNext?: boolean
  showPrevious?: boolean
}

export function NavigationArrows({
  onNext,
  onPrevious,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  showNext = true,
  showPrevious = true,
}: NavigationArrowsProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious()
    } else {
      navigate(-1)
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    }
  }

  return (
    <div className="flex justify-between w-full">
      {showPrevious && (
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {previousLabel}
        </Button>
      )}
      {showNext && onNext && (
        <Button onClick={handleNext} className="flex items-center gap-2 ml-auto">
          {nextLabel}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
} 