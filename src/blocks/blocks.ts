import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Normal', value: 'normal' },
      ],
    },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image + Text', plural: 'Image + Text Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Stats Row', plural: 'Stats Rows' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: { singular: 'Team / Values Grid', plural: 'Team / Values Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'members',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', type: 'text', admin: { width: '50%' } },
        { name: 'buttonHref', type: 'text', admin: { width: '50%' } },
      ],
    },
  ],
}

export const pageBlocks = [RichTextBlock, ImageTextBlock, StatsBlock, TeamBlock, CtaBlock]
