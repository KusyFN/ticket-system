"use client"
import { useEffect } from "react"
import { Check } from "lucide-react"

interface CompletionModalProps {
  isOpen: boolean
  onClose: () => void
  type: "add" | "reduce"
}

export default function CompletionModal({ isOpen, onClose, type }: CompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-2xl animate-scale-in max-w-sm mx-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            type === "add" ? "bg-secondary" : "bg-destructive"
          }`}
        >
          <Check
            className={`w-8 h-8 ${type === "add" ? "text-secondary-foreground" : "text-destructive-foreground"}`}
          />
        </div>

        <h2 className="text-xl font-bold text-card-foreground mb-2">{type === "add" ? "追加完了！" : "減少完了！"}</h2>

        <p className="text-muted-foreground text-sm">
          {type === "add" ? "待ち組数が増加しました" : "待ち組数が減少しました"}
        </p>
      </div>
    </div>
  )
}
