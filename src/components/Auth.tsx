import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false)

  const initializeSurveyData = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_survey_data')
        .insert([
          {
            id: userId,
            personal_info: null,
            medical_history: null,
          },
        ])
      if (error) throw error
    } catch (error: any) {
      console.error('Error initializing survey data:', error)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          await initializeSurveyData(data.user.id)
          alert('Check your email for the confirmation link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        navigate('/')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="relative h-16 border-b flex items-center px-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Back to landing page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold ml-4">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h1>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAuth}
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
            
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 