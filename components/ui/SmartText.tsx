'use client'

import React from 'react'
import LinkPreview from './LinkPreview'

interface SmartTextProps {
  text: string
  className?: string
}

export default function SmartText({ text, className = '' }: SmartTextProps) {
  // Regex to find URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Find the first URL for the preview
  const firstUrl = text.match(urlRegex)?.[0]

  // Split text by URL and map parts to either text or <a> tags
  const parts = text.split(urlRegex)

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {part}
              </a>
            )
          }
          return part
        })}
      </p>

      {firstUrl && <LinkPreview url={firstUrl} />}
    </div>
  )
}
