import Image from 'next/image'

interface StepIllustrationProps {
  step: number
}

export function StepIllustration({ step }: StepIllustrationProps) {
  return (
    <div className="hidden lg:block flex-1">
      <Image
        src="/images/booking-process.png"
        alt={`Step ${step} illustration`}
        width={500}
        height={500}
        style={{ width: '100%', height: 'auto' }}
        priority
      />
    </div>
  )
}