import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-rust/40">
                <Image
                  src="/pino2.png"
                  alt="Pino"
                  width={40}
                  height={40}
                  className="object-cover object-top scale-125"
                />
              </div>
              <span className="font-display text-3xl tracking-widest text-cream">
                BAD <span className="text-rust">DOG</span>
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed">
              Hundeschule für Hunde, die mehr können.
              <br />Adlikon bei Winterthur.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="section-label mb-4">Navigation</p>
            <ul className="space-y-2">
              {[
                ['/', 'Startseite'],
                ['/kurse', 'Kurse'],
                ['/buchen', 'Buchen'],
                ['/lernvideos', 'Lernvideos'],
                ['/ueber-uns', 'Über uns'],
                ['/kontakt', 'Kontakt'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-cream/60 hover:text-cream transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="section-label mb-4">Kontakt</p>
            <address className="not-italic text-sm text-cream/60 space-y-1.5">
              <p>Bad Dog Hundeschule</p>
              <p>Andelfingerstrasse 2b</p>
              <p>8452 Adlikon</p>
              <p className="pt-2">
                <Link href="/kontakt" className="text-rust hover:text-rust-light transition-colors">
                  Nachricht senden →
                </Link>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} Bad Dog Hundeschule · Adlikon
          </p>
          <p className="text-muted text-xs">
            Trainer: Marcus
          </p>
        </div>
      </div>
    </footer>
  )
}
