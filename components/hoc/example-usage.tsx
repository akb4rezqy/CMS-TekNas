// Contoh penggunaan berbagai HOC yang telah dibuat
import { withLayout, withHeaderOnly, withMinimalLayout } from "./with-layout"

// 1. Halaman dengan layout lengkap (header + footer)
const AboutPage = () => (
  <div className="container mx-auto py-12">
    <h1 className="text-4xl font-bold">Tentang Kami</h1>
    <p>Ini adalah halaman tentang kami dengan layout lengkap.</p>
  </div>
)
export const AboutPageWithLayout = withLayout(AboutPage)

// 2. Halaman dengan header saja (tanpa footer)
const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md w-full space-y-8">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      <form className="space-y-6">
        <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
        <button className="w-full bg-primary text-white p-3 rounded">Masuk</button>
      </form>
    </div>
  </div>
)
export const LoginPageWithHeader = withHeaderOnly(LoginPage)

// 3. Halaman minimal (tanpa header dan footer)
const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white">
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4">Welcome</h1>
      <p className="text-xl">Halaman landing dengan layout minimal</p>
    </div>
  </div>
)
export const LandingPageMinimal = withMinimalLayout(LandingPage)
