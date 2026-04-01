import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <p className="section-label mb-2">Kundenportal</p>
          <h1 className="font-display text-5xl tracking-wider text-cream">
            ANMELDEN
          </h1>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-card border border-border shadow-none rounded-none w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border border-border bg-surface text-cream hover:bg-card rounded-none',
                dividerLine: 'bg-border',
                dividerText: 'text-muted text-xs',
                formFieldLabel: 'text-cream/70 text-xs uppercase tracking-widest',
                formFieldInput: 'bg-surface border border-border text-cream rounded-none focus:border-rust focus:ring-0',
                formButtonPrimary: 'bg-rust hover:bg-rust/80 text-cream rounded-none font-semibold tracking-widest uppercase text-sm',
                footerActionLink: 'text-rust hover:text-rust/80',
                identityPreviewText: 'text-cream',
                identityPreviewEditButton: 'text-rust',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
