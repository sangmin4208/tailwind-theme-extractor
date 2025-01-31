'use client'

import { useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { extractTailwindTheme } from '@/lib/utils/extract-tailwind-theme'
import { useCopyToClipboard } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [tailwindTheme, setTailwindTheme] = useState(extractTailwindTheme(''))
  const [_, copy] = useCopyToClipboard()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChange = (e) => {
    const result = extractTailwindTheme(e.target.value)
    setTailwindTheme(result)
  }
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // 높이 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // 내용에 맞게 높이 조절
    }
  }

  const handleCopy = async () => {
    await copy(JSON.stringify(tailwindTheme, null, 2))
    toast.success('Copied to clipboard!')
  }
  return (
    <div className={'container'}>
      <h1 className={'my-2 text-2xl font-bold'}>Extract Tailwind Theme</h1>

      <section className={'mt-10 grid grid-cols-2 items-start gap-4'}>
        <Textarea
          ref={textareaRef}
          placeholder="Type your Tailwind CSS here"
          onChange={handleChange}
          onInput={handleInput} // 입력될 때마다 크기 조정
          className={'min-h-[600px] resize-none overflow-hidden'} // 기본 크기 조정 비활성화
        />

        <div
          className={'bg-primary relative text-primary-foreground rounded p-5 text-sm'}
        >
          <Button onClick={handleCopy} className={'absolute top-5 right-5'}>
            <Copy/>
          </Button>
          <pre>{JSON.stringify(tailwindTheme, null, 2)}</pre>
        </div>
      </section>
    </div>
  )
}
