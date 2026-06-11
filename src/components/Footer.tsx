import { Logo } from '@/components/Logo'
import { Newsletter } from '@/components/Newsletter'
import { getFooter, getSiteSettings } from '@/lib/queries'
import { Github, Instagram, Linkedin, type LucideIcon, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'

const socialIcons: Record<string, LucideIcon> = {
  twitter: Twitter,
  github: Github,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

export const Footer = async () => {
  const [footer, settings] = await Promise.all([getFooter(), getSiteSettings()])

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0a0f1f] text-neutral-300">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div className="flex flex-col gap-5">
            <span className="text-white">
              <Logo storeName={settings.storeName} />
            </span>
            <p className="max-w-sm text-sm text-neutral-400">
              Premium computer accessories engineered for the people who live at their desks.
            </p>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-neutral-500">
                Join the list
              </p>
              <Newsletter />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {(footer.columns ?? []).map((col, i) => (
              <div key={i}>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-neutral-500">
                  {col.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {(col.links ?? []).map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-300 transition-colors hover:text-volt"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-500">
            {footer.copyright || `© 2025 ${settings.storeName}.`}
          </p>
          <div className="flex items-center gap-2">
            {(footer.socialLinks ?? []).map((s, i) => {
              const Icon = socialIcons[s.platform]
              if (!Icon) return null
              return (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.platform}
                  className="grid size-9 place-items-center rounded-md border border-white/15 text-neutral-300 transition-colors hover:border-volt hover:text-volt"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
