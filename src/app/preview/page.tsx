"use client"
import { useEffect, useState } from "react"
import { Eye, RefreshCw } from "lucide-react"

export default function PreviewPage() {
  const [count, setCount] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function fetchCount() {
    setIsRefreshing(true)
    const res = await fetch("/api/preview", {
      cache: "no-store",
    })
    const data = await res.json()
    setCount(data.count)
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchCount()

    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={fetchCount}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            更新
          </button>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xl animate-fade-in">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
              <Eye className="w-10 h-10 text-primary-foreground" />
            </div>

            <h1 className="text-2xl font-bold text-card-foreground mb-8 font-[family-name:var(--font-heading)]">
              現在の待ち組数
            </h1>

            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-8 mb-6">
              <div className="text-6xl font-black text-foreground mb-2 font-[family-name:var(--font-heading)]">
                {count !== null ? count : "..."}
              </div>
              <div className="text-muted-foreground">{count !== null ? "組" : "読み込み中"}</div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              30秒ごとに自動更新
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
