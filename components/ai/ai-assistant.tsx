'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'Toshkentda 3 xonali kvartira bormi?',
  'Rent-to-Own qanday ishlaydi?',
  'E-auktsionda qanday qatnashaman?',
  'Ipoteka olish tartibi qanday?',
]

function renderTextWithLinks(text: string) {
  const parts = text.split(/(\/(?:mulklar|auktsion|rent-to-own|narx-baholash|bank|xaridor|investor|rieltor|kompaniya)(?:\/[\w-]+)?)/g)
  return parts.map((part, i) =>
    part.startsWith('/') ? (
      <Link key={i} href={part} className="font-medium text-primary underline underline-offset-2">
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6"
        aria-label={open ? 'AI yordamchini yopish' : 'AI yordamchini ochish'}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:bottom-24 md:right-6"
          role="dialog"
          aria-label="AI yordamchi"
        >
          <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Bot className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">3D MULK AI Yordamchi</p>
              <p className="text-xs opacity-80">{"O'zbek tilida 24/7 yordam"}</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Assalomu alaykum! Mulk qidirish, narxlar, ipoteka yoki auktsion haqida savol bering.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'self-end rounded-br-sm bg-primary text-primary-foreground'
                        : 'self-start rounded-bl-sm bg-muted text-foreground',
                    )}
                  >
                    {message.parts.map((part, i) =>
                      part.type === 'text' ? (
                        <p key={i} className="whitespace-pre-wrap">
                          {message.role === 'assistant' ? renderTextWithLinks(part.text) : part.text}
                        </p>
                      ) : null,
                    )}
                  </div>
                ))}
                {status === 'submitted' && (
                  <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Yozmoqda...
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault()
              submit(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Savolingizni yozing..."
              className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
              aria-label="Savol yozish"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
              aria-label="Yuborish"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
