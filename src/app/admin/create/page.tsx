"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle, AlertCircle, ExternalLink, ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const availableItems = process.env.NEXT_PUBLIC_TICKET_ITEMS?.split(",") ?? [];

export default function CreateTicketPage() {
  const [count, setCount] = useState(1)
  const [item, setItem] = useState(availableItems[0])
  const [createdTickets, setCreatedTickets] = useState<Array<{ id: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)
    setCreatedTickets([])

    try {
      const response = await fetch("/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count, item }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tickets")
      }

      const data = await response.json()
      setCreatedTickets(data.tickets)
      setSuccessMessage(`${data.tickets.length}枚のチケットが正常に作成されました。`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-3">
            <Plus className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              チケット作成
            </h1>
          </div>
          <p className="text-gray-600">新しいチケットを一括で作成します</p>
        </div>

        {/* Creation Form */}
        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">作成設定</CardTitle>
            <CardDescription>作成するチケットの枚数と品目を指定してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="item" className="text-sm font-medium text-gray-700">
                  品目
                </Label>
                <Select value={item} onValueChange={setItem} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="品目を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count" className="text-sm font-medium text-gray-700">
                  作成枚数
                </Label>
                <Input
                  type="number"
                  id="count"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full"
                  disabled={loading}
                  placeholder="1"
                />
                <p className="text-xs text-gray-500">1〜100枚まで指定可能です</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>作成中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>チケット作成</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {loading && (
          <Alert className="max-w-md mx-auto bg-blue-50 border-blue-200">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <AlertDescription className="text-blue-700">チケットを作成中です...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="max-w-md mx-auto bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">エラー: {error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="max-w-md mx-auto bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Created Tickets List */}
        {createdTickets.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>作成されたチケット</span>
                <Badge variant="secondary" className="ml-2">
                  {createdTickets.length}枚
                </Badge>
              </CardTitle>
              <CardDescription>以下のチケットIDが作成されました。リンクをクリックして確認できます。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {createdTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-medium text-gray-800">{ticket.id}</span>
                      <a
                        href={`/ticket?id=${ticket.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}


        
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">JSONとしてコピー</CardTitle>
            <CardDescription>以下のJSONをコピーして外部ツールなどで活用できます。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <textarea
                readOnly
                className="w-full text-sm font-mono p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                rows={Math.min(10, createdTickets.length)}
                value={JSON.stringify(createdTickets.map((t) => t.id), null, 2)}
              />
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(createdTickets.map((t) => t.id), null, 2))
                }}
              >
                コピー
              </Button>
            </div>
          </CardContent>
        </Card>


        
        {/* Navigation */}
        <div className="text-center space-y-4">
          <Link href="/admin">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              管理者ダッシュボードに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
