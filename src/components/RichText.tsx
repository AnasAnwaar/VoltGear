import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/utilities/cn'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  data?: SerializedEditorState | null
  className?: string
}

/** Renders Payload Lexical rich text with Tailwind Typography styling. */
export const RichText = ({ data, className }: Props) => {
  if (!data) return null

  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-headings:tracking-tight prose-a:text-volt prose-a:no-underline hover:prose-a:underline',
        className,
      )}
    >
      <LexicalRichText data={data} />
    </div>
  )
}
