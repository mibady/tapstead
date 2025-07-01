"use client"

import Image from 'next/image'

interface StepIllustrationProps {
  step: number;
}

const STEP_IMAGES = {
  1: {
    src: '/characters-with-objects/4.png',
    alt: 'Select your cleaning plan'
  },
  2: {
    src: '/characters-with-objects/2.png',
    alt: 'Choose your schedule'
  },
  3: {
    src: '/characters-with-objects/3.png',
    alt: 'Enter your details'
  },
  4: {
    src: '/characters-with-objects/1.png',
    alt: 'Review and confirm'
  }
} as const;

export function StepIllustration({ step }: StepIllustrationProps) {
  const image = STEP_IMAGES[step as keyof typeof STEP_IMAGES];
  if (!image) return null;

  return (
    <div className="hidden lg:block lg:w-1/3">
      <div className="relative h-[300px] w-full">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-contain"
          loading="lazy"
        />
      </div>
      <p className="text-center text-muted-foreground mt-4">{image.alt}</p>
    </div>
  );
}