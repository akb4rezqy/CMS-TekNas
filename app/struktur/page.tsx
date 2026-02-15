"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface OrgNode {
  id: string
  position_name: string
  person_name: string
  parent_id: string | null
  sort_order: number
  children?: OrgNode[]
}

function buildTree(items: OrgNode[]): OrgNode[] {
  const map: Record<string, OrgNode> = {}
  const roots: OrgNode[] = []

  items.forEach((item) => {
    map[item.id] = { ...item, children: [] }
  })

  items.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children!.push(map[item.id])
    } else {
      roots.push(map[item.id])
    }
  })

  return roots
}

function OrgTreeNode({ node, level = 0 }: { node: OrgNode; level?: number }) {
  const animation = useScrollAnimation(0.1)

  return (
    <div className="flex flex-col items-center">
      <div
        ref={animation.ref}
        className={`transition-all duration-700 ${
          animation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group w-64 md:w-72">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg font-bold group-hover:text-primary transition-colors duration-300">
              {node.position_name}
            </CardTitle>
            <CardDescription className="text-sm font-medium text-foreground/80">
              {node.person_name}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-border" />
          <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
            {node.children
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="w-px h-4 bg-border" />
                  <OrgTreeNode node={child} level={level + 1} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

function StrukturOrganisasiPage() {
  const headerAnimation = useScrollAnimation(0.1)
  const [data, setData] = useState<OrgNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/org-structure")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setData(result.data || [])
        } else {
          setError(result.error || "Gagal memuat data")
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const tree = buildTree(data)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div
        ref={headerAnimation.ref}
        className={`text-center mb-8 md:mb-12 transition-all duration-1000 ${
          headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
          Struktur Organisasi Sekolah
        </h1>
        <p className="max-w-3xl mx-auto text-muted-foreground text-base md:text-lg lg:text-xl">
          Mengenal jajaran pimpinan, guru, dan staf yang membentuk struktur organisasi SMK Teknologi Nasional.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Memuat data...</span>
        </div>
      ) : error ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </CardContent>
        </Card>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada data struktur organisasi yang tersedia.</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          {tree
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((root) => (
              <OrgTreeNode key={root.id} node={root} />
            ))}
        </div>
      )}
    </div>
  )
}

export default withLayout(StrukturOrganisasiPage)
