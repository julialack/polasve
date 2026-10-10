'use client'

import React from 'react'
import { capitalizeFirst } from '@/utils/capitalize'

interface SmartTextProps {
  text: string
  className?: string
}

export default function SmartText({ text, className = '' }: SmartTextProps) {
  const formattedText = capitalizeFirst(text)

  // Advanced Regex matching http://, https://, www., or common TLDs
  const urlRegex = /((?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(?:se|com|pl|nu|net|org|info|eu|io)[^\s]*)/gi

  const parts = formattedText.split(urlRegex)

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (!part) return null

          const isUrl = /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.(se|com|pl|nu|net|org|info|eu|io))/i.test(part)

          if (isUrl) {
            // Strip trailing punctuation (like ., !, ?, ), ], ", ') from the actual href link
            const cleanUrl = part.replace(/[.,!?:;)"']+$/, '')
            let href = cleanUrl

            // Fix case-insensitive protocol (e.g. Https:// -> https://)
            if (/^https?:\/\//i.test(href)) {
              href = href.replace(/^https?:\/\//i, (match) => match.toLowerCase())
            } else {
              href = `https://${href}`
            }

            return (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 font-bold hover:underline break-all relative z-10 inline-block cursor-pointer"
              >
                {part}
              </a>
            )
          }
          return part
        })}
      </p>
    </div>
  )
}
