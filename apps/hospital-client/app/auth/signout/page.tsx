"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, LogOut, Sparkles } from "lucide-react"

export default function SignOutPage() {
  const [countdown, setCountdown] = useState(5)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Redirect to login page using the URL from env
          const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://clinqo.in'
          window.location.href = `${baseUrl}/auth/login`
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleManualRedirect = () => {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://clinqo.in'
    window.location.href = `${baseUrl}/auth/login`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className={`w-full max-w-md mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0 relative z-10 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <CardHeader className="text-center space-y-6 pb-6">
          <div className="mx-auto relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 hover:scale-110">
              <CheckCircle className="w-10 h-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
            <Sparkles className="absolute -top-1 -left-1 w-4 h-4 text-blue-300 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-blue-900 animate-fade-in">
              Successfully Signed Out
            </CardTitle>
            <CardDescription className="text-blue-700 text-base">
              Thank you for using Clinqo. Your session has been securely terminated.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-blue-800 bg-blue-50 rounded-lg p-3 animate-slide-in">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">You've been logged out securely</span>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 shadow-inner">
              <p className="text-sm text-blue-800 mb-3 font-medium">
                Redirecting to login page in:
              </p>
              <div className="relative">
                <div className="text-4xl font-bold text-blue-600 animate-pulse-scale">
                  {countdown}
                </div>
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping" style={{animationDuration: '1s'}}></div>
              </div>
              <p className="text-xs text-blue-600 mt-2 font-medium">seconds</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 space-y-2 animate-fade-in-up">
              <div className="flex items-center space-x-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <p className="text-sm">All your session data has been cleared</p>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <p className="text-sm">Your account remains secure</p>
              </div>
              <div className="flex items-center space-x-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <p className="text-sm">You can sign in again anytime</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-200">
            <p className="text-center text-sm text-blue-700">
              If you're not redirected automatically,{" "}
              <button
                onClick={handleManualRedirect}
                className="text-blue-600 hover:text-blue-800 underline font-semibold hover:no-underline transition-all duration-200 transform hover:scale-105"
              >
                click here to sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.6s ease-out 0.3s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}