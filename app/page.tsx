'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('affiliate_session')
    if (session) {
      try {
        const sessionData = JSON.parse(session)
        if (sessionData.expires > Date.now()) {
          router.push('/dashboard')
          return
        } else {
          localStorage.removeItem('affiliate_session')
        }
      } catch (error) {
        localStorage.removeItem('affiliate_session')
      }
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <LoginForm />
}