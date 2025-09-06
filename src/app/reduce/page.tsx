"use client"
import { useState } from "react"
import { Minus, Loader2 } from "lucide-react"
import CompletionModal from "@/components/completion-modal"

export default function ReducePage() {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleReduce() {
    setLoading(true)
    await fetch("/api/reduce", { method: "POST" })
    setLoading(false)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4 py-16">

        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl animate-fade-in">
            <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto mb-8">
              <Minus className="w-10 h-10 text-destructive-foreground" />
            </div>

            <h1 className="text-3xl font-black text-card-foreground mb-6 font-[family-name:var(--font-heading)]">
              待ち組数を減らす
            </h1>

            <p className="text-muted-foreground mb-8 leading-relaxed">待ち組を完了させます</p>

            <button
              onClick={handleReduce}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  減少中...
                </>
              ) : (
                <>
                  <Minus className="w-5 h-5" />
                  待ち組数を減らす
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <CompletionModal isOpen={showModal} onClose={() => setShowModal(false)} type="reduce" />
    </div>
  )
}
