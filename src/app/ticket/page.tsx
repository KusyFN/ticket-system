"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, AlertCircle, Home, Utensils, Star } from "lucide-react"
import { RefreshCw } from "lucide-react"

interface TicketType {
  id: string
  status: "available" | "used"
  item: string
  createdAt: string
  usedAt: string | null
}

export default function TicketPage() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("id")
  const [ticket, setTicket] = useState<TicketType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  {/*const [usingTicket, setUsingTicket] = useState(false)*/}
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

  {/*const handleUseTicket = async () => {
    if (!ticketId || !ticket || ticket.status === "used") return

    setUsingTicket(true)
    setError(null)

    try {
      const response = await fetch(`/api/tickets/${ticketId}/use`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to use ticket")
      }

      setTicket({ ...ticket, status: "used", usedAt: new Date().toISOString() })
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました。")
    } finally {
      setUsingTicket(false)
    }
  }*/}

  useEffect(() => {
    if (!ticketId) {
      setError("Ticket ID is missing.")
      setLoading(false)
      return
    }

    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${ticketId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch ticket")
        }
        const data: TicketType = await response.json()
        setTicket(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました。")
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-600 font-medium">{error ? `エラー: ${error}` : "チケットが見つかりません。"}</p>
          <Link href="/">
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm">
              <Home className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Ticket Container */}
        <div className="relative mx-auto max-w-full">
          {/* Ticket Shadow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-lg transform rotate-1 translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-2"></div>

          {/* Main Ticket */}
          <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white px-4 py-3 md:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <Utensils className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-lg md:text-xl font-bold">TICKET</h1>
                    <p className="text-xs md:text-sm opacity-90">
                      {process.env.NEXT_PUBLIC_SHOP_NAME}
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-xs md:text-sm opacity-90">TICKET NO.</div>
                  <div className="text-base md:text-lg font-mono font-bold">{ticket.id.slice(-6)}</div>
                </div>
              </div>
            </div>

            {/* Main Content Area - Responsive Layout */}
            <div className="flex flex-col md:flex-row">
              {/* Stub Section - Top on mobile, Left on desktop */}
              <div className="w-full md:w-1/3 bg-gradient-to-b from-purple-50 to-pink-50 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-purple-300 p-4 md:p-6 flex flex-row md:flex-col justify-between md:justify-between relative">
                {/* Mobile: Horizontal layout, Desktop: Vertical layout */}
                <div className="flex flex-row md:flex-col items-center md:items-center space-x-4 md:space-x-0 md:space-y-4 w-full">
                  {/* Stub Header */}
                  <div className="text-center flex-shrink-0">
                    <div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 flex items-center justify-center shadow-md">
                      <Utensils className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base">STUB</h3>
                    <p className="text-xs text-gray-600">半券</p>
                  </div>

                  {/* Stub Content */}
                  <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-4 flex-1 md:flex-none">
                    <div className="text-center flex-1 md:flex-none">
                      <div className="text-xs text-gray-500 uppercase mb-1">Item</div>
                      <div className="font-semibold text-gray-800 text-xs md:text-sm">{ticket.item}</div>
                    </div>

                    <div className="text-center flex-1 md:flex-none">
                      <div className="text-xs text-gray-500 uppercase mb-1">Ticket</div>
                      <div className="font-mono text-xs bg-white px-2 py-1 rounded border">{ticket.id.slice(-8)}</div>
                    </div>

                    <div className="text-center flex-1 md:flex-none">
                      <div className="text-xs text-gray-500 uppercase mb-1">Date</div>
                      <div className="text-xs text-gray-700">
                        {new Date(ticket.createdAt).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  </div>

                  {/* Stub Status */}
                  <div className="text-center flex-shrink-0">
                    {ticket.status === "available" ? (
                      <div className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                        VALID
                      </div>
                    ) : (
                      <div className="bg-red-100 text-red-800 px-2 md:px-3 py-1 rounded-full text-xs font-semibold">
                        USED
                      </div>
                    )}
                  </div>
                </div>

                {/* Perforations - Horizontal on mobile, Vertical on desktop */}
                <div className="absolute bottom-0 md:bottom-auto md:right-0 left-0 md:left-auto md:top-0 w-full md:w-1 h-1 md:h-full flex flex-row md:flex-col justify-around md:justify-around">
                  {Array.from({ length: window.innerWidth < 768 ? 15 : 20 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-purple-300 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* Main Section - Bottom on mobile, Right on desktop */}
              <div className="flex-1 p-4 md:p-8">
                {/* Main Ticket Info */}
                <div className="space-y-4 md:space-y-6">
                  {/* Event/Item Title */}
                  <div className="text-center border-b border-gray-200 pb-3 md:pb-4">
                    <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">{ticket.item}</h2>
                    <div className="flex items-center justify-center space-x-2 text-purple-600">
                      <Star className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-lg">プレミアムチケット</span>
                      <Star className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>

                  {/* Ticket Details Grid - Single column on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">
                          Ticket Number
                        </div>
                        <div className="text-lg md:text-2xl font-mono font-bold text-gray-800 bg-gray-100 px-3 md:px-4 py-2 rounded-lg break-all">
                          {ticket.id}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">Issue Date</div>
                        <div className="flex items-center space-x-2 text-gray-700 text-sm md:text-base">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(ticket.createdAt).toLocaleString("ja-JP")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div>
                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">Status</div>
                        {ticket.status === "available" ? (
                          <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-3 md:px-4 py-2 rounded-lg border border-green-200">
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="font-semibold text-sm md:text-base">使用可能</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 bg-red-50 text-red-800 px-3 md:px-4 py-2 rounded-lg border border-red-200">
                            <XCircle className="h-4 w-4 md:h-5 md:w-5" />
                            <span className="font-semibold text-sm md:text-base">使用済み</span>
                          </div>
                        )}
                      </div>

                      {ticket.usedAt && (
                        <div>
                          <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wide mb-1">Used Date</div>
                          <div className="flex items-center space-x-2 text-gray-700 text-sm md:text-base">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(ticket.usedAt).toLocaleString("ja-JP")}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button
                  {ticket.status === "available" && (
                    <div className="pt-4 md:pt-6 border-t border-gray-200">
                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={handleUseTicket}
                        disabled={usingTicket}
                      >
                        {usingTicket ? (
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                            <span>チケット使用中...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                            <span>このチケットを使用する</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  )}
                  */}

                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                            <span>まだTicketは使えません</span>
                          </div>
                      </Button>
                    </div>

                  {/* Barcode Area */}
                  <div className="pt-3 md:pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-xs font-mono text-gray-600 break-all">{ticket.id}</div>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-card-foreground mb-8 font-[family-name:var(--font-heading)]">
                    現在の待ち組数
                  </h1>

                  <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl p-8 mb-6">
                    <div className="flex items-center justify-center text-6xl font-black text-foreground mb-2 font-[family-name:var(--font-heading)] ">
                      {count !== null ? count : "..."}
                    </div>
                    <div className="text-muted-foreground flex justify-end">{count !== null ? "組" : "読み込み中"}</div>
                  </div>

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

                </div>
              </div>
            </div>

            {/* Bottom Border with Perforations */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 h-3 md:h-4 flex justify-between items-center px-2 md:px-4">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-purple-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mt-4 md:mt-6 bg-red-50 border-red-200 rounded-lg max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">エラー: {error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="text-center mt-6 md:mt-8">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/70 backdrop-blur-sm border-purple-200 hover:bg-white/90 text-purple-700 font-medium px-6 md:px-8 py-2 md:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Home className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
