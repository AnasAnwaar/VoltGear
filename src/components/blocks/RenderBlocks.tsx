import type { ImageTextBlock, Page, StatsBlock, TeamBlock, CtaBlock } from '@/payload-types'

import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import Link from 'next/link'

type Block = NonNullable<Page['layout']>[number]

const ImageText = ({ block }: { block: ImageTextBlock }) => (
  <div className="container">
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className={cn('flex flex-col gap-4', block.imagePosition === 'left' && 'lg:order-2')}>
        {block.eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-volt">{block.eyebrow}</p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight">{block.heading}</h2>
        {block.body && <RichText data={block.body} />}
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-card">
        <Img media={block.image} size="full" imgClassName="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
      </div>
    </div>
  </div>
)

const Stats = ({ block }: { block: StatsBlock }) => (
  <div className="container">
    <div className="rounded-3xl border bg-card p-10 sm:p-14">
      {block.heading && (
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          {block.heading}
        </h2>
      )}
      <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {(block.stats ?? []).map((s, i) => (
          <div key={i} className="text-center">
            <dt className="font-mono text-4xl font-semibold tracking-tight text-volt sm:text-5xl">
              {s.value}
            </dt>
            <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
)

const Team = ({ block }: { block: TeamBlock }) => (
  <div className="container">
    {block.heading && (
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{block.heading}</h2>
        {block.description && (
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{block.description}</p>
        )}
      </div>
    )}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(block.members ?? []).map((m, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl border bg-card p-6">
          {m.image && (
            <div className="relative size-16 overflow-hidden rounded-full border bg-background">
              <Img media={m.image} size="thumbnail" imgClassName="object-cover" sizes="64px" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{m.name}</h3>
            {m.role && (
              <p className="font-mono text-xs uppercase tracking-widest text-volt">{m.role}</p>
            )}
          </div>
          {m.bio && <p className="text-sm text-muted-foreground">{m.bio}</p>}
        </div>
      ))}
    </div>
  </div>
)

const Cta = ({ block }: { block: CtaBlock }) => (
  <div className="container">
    <div className="relative overflow-hidden rounded-3xl border bg-card p-10 text-center sm:p-16">
      <div className="volt-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{block.heading}</h2>
        {block.text && <p className="text-muted-foreground">{block.text}</p>}
        {block.buttonLabel && block.buttonHref && (
          <Button asChild variant="volt" size="xl">
            <Link href={block.buttonHref}>{block.buttonLabel}</Link>
          </Button>
        )}
      </div>
    </div>
  </div>
)

const BlockRenderer = ({ block }: { block: Block }) => {
  switch (block.blockType) {
    case 'richText':
      return (
        <div className={cn('container', block.width === 'narrow' ? 'max-w-2xl' : 'max-w-3xl')}>
          <RichText data={block.content} />
        </div>
      )
    case 'imageText':
      return <ImageText block={block} />
    case 'stats':
      return <Stats block={block} />
    case 'team':
      return <Team block={block} />
    case 'cta':
      return <Cta block={block} />
    default:
      return null
  }
}

export const RenderBlocks = ({ blocks }: { blocks?: Page['layout'] }) => {
  if (!blocks || blocks.length === 0) return null
  return (
    <div className="flex flex-col gap-20">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  )
}
