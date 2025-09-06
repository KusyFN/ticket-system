"use client"
import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import CompletionModal from "@/components/completion-modal"

export default function AddPage() {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleAdd() {
    setLoading(true)
    await fetch("/api/add", { method: "POST" })
    setLoading(false)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      <div className="container mx-auto px-4 py-16">

        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl animate-fade-in">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
              <Plus className="w-10 h-10 text-secondary-foreground" />
            </div>

            <h1 className="text-3xl font-black text-card-foreground mb-6 font-[family-name:var(--font-heading)]">
              待ち組数を増やす
            </h1>

            <p className="text-muted-foreground mb-8 leading-relaxed">新しい待ち組を追加します</p>

            <button
              onClick={handleAdd}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  追加中...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  待ち組数を増やす
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <CompletionModal isOpen={showModal} onClose={() => setShowModal(false)} type="add" />
    </div>
  )
}
