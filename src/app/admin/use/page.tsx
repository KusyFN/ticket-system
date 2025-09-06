"use client"

import { Html5QrcodeScanner } from "html5-qrcode"
import type React from "react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Keyboard, CheckCircle, AlertCircle, ArrowLeft, Camera, Utensils } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface TicketInfo {
  id: string;
  item: string;
  status: 'available' | 'used';
}

export default function UseTicketPage() {
  const [ticketId, setTicketId] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<HTMLDivElement>(null)
  const scannerInstanceRef = useRef<Html5QrcodeScanner | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [ticketToConfirm, setTicketToConfirm] = useState<TicketInfo | null>(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [showErrorAnimation, setShowErrorAnimation] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchTicketInfo = async (id: string): Promise<TicketInfo | null> => {
    try {
      const response = await fetch(`/api/tickets/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch ticket');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      return null;
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;

    setLoading(true);
    setError(null);
    const ticketInfo = await fetchTicketInfo(ticketId);
    setLoading(false);

    if (ticketInfo) {
      if (ticketInfo.status === 'used') {
        setError(`チケット ${ticketId} は既に使用済みです。`);
      } else {
        setTicketToConfirm(ticketInfo);
        setShowConfirmModal(true);
      }
    } 
  };

  const handleUseTicket = async () => {
    if (!ticketToConfirm) return;

    setLoading(true);
    setMessage(null);
    setError(null);
    setModalError(null);

    try {
      const response = await fetch(`/api/tickets/${ticketToConfirm.id}/use`, { method: "POST" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "チケットの使用に失敗しました。")
      }

      setShowSuccessAnimation(true)
      setTimeout(() => {
        setShowConfirmModal(false)
        setShowSuccessAnimation(false)
        setMessage(`チケット ${ticketToConfirm.id} が正常に使用されました。`)
        setTicketToConfirm(null);
        setTicketId("");
      }, 2000)

    } catch (err) {
      setModalError(err instanceof Error ? err.message : "不明なエラーが発生しました。");
      setShowErrorAnimation(true)
      setTimeout(() => {
        setShowErrorAnimation(false)
        setModalError(null);
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const onScanSuccess = async (decodedText: string) => {
    stopScanner();
    const match = decodedText.match(/[?&]id=([a-zA-Z0-9]{6})/);
    const id = match ? match[1] : (/^[a-zA-Z0-9]{6}$/.test(decodedText) ? decodedText : null);

    if (id) {
      setMessage(`チケットID ${id} をスキャンしました。情報を確認中...`);
      const ticketInfo = await fetchTicketInfo(id);
      if (ticketInfo) {
        if (ticketInfo.status === 'used') {
          setError(`チケット ${id} は既に使用済みです。`);
          setMessage(null);
        } else {
          setTicketToConfirm(ticketInfo);
          setShowConfirmModal(true);
          setMessage(null);
        }
      }
    } else {
      setError("QRコードの内容が不正です。正しいチケットQRコードをスキャンしてください。");
    }
  };

  const startScanner = () => {
    if (scannerRef.current && !scannerInstanceRef.current) {
      setIsScanning(true)
      setError(null)

      scannerInstanceRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false,
      )

      scannerInstanceRef.current.render(onScanSuccess, (errorMessage: string) => {
        console.warn("QRスキャンエラー:", errorMessage)
      })
    }
  }

  const stopScanner = () => {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear().catch((err) => {
        console.warn("スキャナークリアエラー:", err)
      })
      scannerInstanceRef.current = null
      setIsScanning(false)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError(null)
    setMessage(null)

    if (value === "scan") {
      setTimeout(() => {
        startScanner()
      }, 100)
    } else {
      stopScanner()
    }
  }

  const handleCancelConfirm = () => {
    setShowConfirmModal(false)
    setTicketToConfirm(null)
    setMessage(null)
    setShowSuccessAnimation(false)
    setShowErrorAnimation(false)
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-3">
            <QrCode className="h-10 w-10 text-red-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              チケット使用
            </h1>
          </div>
          <p className="text-gray-600">QRコードスキャンまたは手動入力でチケットを使用</p>
        </div>

        {/* Input Methods */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">使用方法を選択</CardTitle>
            <CardDescription>QRコードスキャンまたは手動入力を選択してください</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" className="flex items-center space-x-2">
                  <Keyboard className="h-4 w-4" />
                  <span>手動入力</span>
                </TabsTrigger>
                <TabsTrigger value="scan" className="flex items-center space-x-2">
                  <QrCode className="h-4 w-4" />
                  <span>QRスキャン</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4 mt-6">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketId" className="text-sm font-medium text-gray-700">
                      チケットID
                    </Label>
                    <Input
                      type="text"
                      id="ticketId"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      className="w-full font-mono text-center text-lg"
                      disabled={loading}
                      placeholder="例: ABC123"
                      maxLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 rounded-lg transition-all duration-300"
                    disabled={loading || !ticketId}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>確認中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>チケットを確認</span>
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="scan" className="mt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Camera className="h-5 w-5 text-gray-600" />
                      <p className="text-sm text-gray-600">カメラでQRコードをスキャンしてください</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4">
                    <div
                      ref={scannerRef}
                      id="qr-reader"
                      className="w-full max-w-md mx-auto"
                      style={{ minHeight: isScanning ? "300px" : "200px" }}
                    />

                    {!isScanning && activeTab === "scan" && (
                      <div className="text-center py-8">
                        <Button
                          onClick={startScanner}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          スキャンを開始
                        </Button>
                      </div>
                    )}
                  </div>

                  {isScanning && (
                    <div className="text-center">
                      <Button
                        onClick={stopScanner}
                        variant="outline"
                        className="bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white/80"
                      >
                        スキャンを停止
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {message && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">エラー: {error}</AlertDescription>
          </Alert>
        )}

        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md">
            {showSuccessAnimation ? (
              <div className="text-center py-8">
                 <div className="relative">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">使用完了！</h3>
                <p className="text-sm text-green-600">チケットが正常に使用されました</p>
              </div>
            ) : showErrorAnimation ? (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">エラー</h3>
                <p className="text-sm text-red-600">{modalError || 'このチケットは使用できません'}</p>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-blue-600" />
                    <span>チケット使用確認</span>
                  </DialogTitle>
                  <DialogDescription>以下のチケットを使用しますか？</DialogDescription>
                </DialogHeader>
                {ticketToConfirm && (
                  <div className="space-y-4 py-4">
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">品目</p>
                      <div className="flex items-center justify-center space-x-2 text-gray-700">
                        <Utensils className="h-5 w-5 text-purple-600" />
                        <span className="text-xl font-semibold text-gray-800">{ticketToConfirm.item}</span>
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">チケットID</p>
                      <p className="text-2xl font-mono font-bold text-gray-800 bg-gray-100 py-2 px-4 rounded-lg">
                        {ticketToConfirm.id}
                      </p>
                    </div>
                  </div>
                )}
                <DialogFooter className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelConfirm}
                    disabled={loading}
                    className="flex-1 bg-transparent"
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={handleUseTicket}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>使用中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>使用する</span>
                      </div>
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Navigation */}
        <div className="text-center">
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
