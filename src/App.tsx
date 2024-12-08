import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { ThemeProvider, useTheme } from "./components/theme-provider"
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { Survey } from "./pages/Survey"
import { supabase } from "@/lib/supabase"
import Auth from "@/components/Auth"
import Dashboard from "@/components/Dashboard"
import { Button } from "./components/ui/button"
import { useEffect, useState } from "react"
import { User } from '@supabase/supabase-js'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SurveyProvider } from "@/contexts/SurveyContext"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button 
      variant="outline" 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "Dark" : "Light"} Mode
    </Button>
  )
}

function Home({ handleLogout }: { handleLogout: () => Promise<void> }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-foreground">MedlinePlus App</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-6">
            <h2 className="text-4xl font-bold">Your Personal Health Information Assistant</h2>
            <p className="text-xl text-muted-foreground">
              Access reliable medical information, track your health history, and get personalized resources
              all in one place.
            </p>
            <div className="flex justify-center gap-4">
              {user ? (
                <Button size="lg" onClick={() => navigate('/survey')}>
                  Get Started
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate('/login')}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/login', { state: { isSignUp: true }})}>
                    Create Account
                  </Button>
                </>
              )}
            </div>
          </section>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get health information tailored to your medical history and preferences.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reliable Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access trusted medical resources from the National Library of Medicine.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple interface designed to help you find what you need quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [authChecked, setAuthChecked] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/' // Force a full page refresh to clear all states
  }

  useEffect(() => {
    // Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Home handleLogout={handleLogout} />} />
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/" replace /> : <Auth />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard /> : <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/survey" 
              element={
                user ? (
                  <SurveyProvider>
                    <Survey />
                  </SurveyProvider>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App 