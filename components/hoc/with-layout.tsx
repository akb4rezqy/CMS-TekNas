import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileMenuProvider } from "@/components/layout/mobile-menu-provider"

// HOC untuk membungkus komponen dengan layout lengkap
export function withLayout<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithLayoutComponent = (props: T) => {
    return (
      <MobileMenuProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <WrappedComponent {...props} />
          </main>
          <Footer />
        </div>
      </MobileMenuProvider>
    )
  }

  // Set display name untuk debugging yang lebih baik
  WithLayoutComponent.displayName = `withLayout(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  return WithLayoutComponent
}

// HOC untuk halaman yang hanya butuh header (tanpa footer)
export function withHeaderOnly<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithHeaderOnlyComponent = (props: T) => {
    return (
      <MobileMenuProvider>
        <div className="min-h-screen">
          <Header />
          <main>
            <WrappedComponent {...props} />
          </main>
        </div>
      </MobileMenuProvider>
    )
  }

  WithHeaderOnlyComponent.displayName = `withHeaderOnly(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  return WithHeaderOnlyComponent
}

// HOC untuk halaman minimal (tanpa header dan footer)
export function withMinimalLayout<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithMinimalLayoutComponent = (props: T) => {
    return (
      <div className="min-h-screen">
        <WrappedComponent {...props} />
      </div>
    )
  }

  WithMinimalLayoutComponent.displayName = `withMinimalLayout(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`

  return WithMinimalLayoutComponent
}
