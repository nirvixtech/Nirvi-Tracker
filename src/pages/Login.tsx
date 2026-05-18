import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import logo from '../assets/logo.png'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === 'nirvix' && password === 'admin123') {
      toast.success('Login successful!')
      navigate('/dashboard')
    } else if (username === '' || password === '') {
      toast.error('Username and password are required')
    }
    else {
      toast.error('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f9ff] via-[#eef4fb] to-[#e8f0f8] relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[360px] mx-4"
      >
        <Card className="rounded-[28px] p-8 flex flex-col items-center bg-white/80 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] ring-0 border-0 gap-0">

          {/*Logo*/}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-white/60 border border-slate-200/60 shadow-sm"
          >
            <img src={logo} alt="Nirvi Track Logo" className="w-12 h-12 object-contain" />
          </motion.div>

          <CardHeader className="w-full p-0 text-center items-center gap-1.5 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-3xl calistoga-regular bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Nirvi Track
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <CardDescription className="text-sm courgette-regular text-slate-500">
                Internal Project Tracker Platform
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="w-full p-0">
            {/* Login form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onSubmit={handleLogin}
              className="w-full"
            >
              <div className="flex flex-col gap-3 mb-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs trykker-regular text-slate-500">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="h-11 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 bg-white/70 border-slate-200/80 focus:border-[#0367B5]/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 shadow-sm"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs trykker-regular text-slate-500">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="h-11 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 bg-white/70 border-slate-200/80 focus:border-[#0367B5]/40 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 pr-10 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-medium text-white bg-[#0367B5] hover:bg-[#025a9e] active:scale-[0.98] transition-all cursor-pointer border-0"
              >
                <span className="trykker-regular">Log in</span>
              </Button>
            </motion.form>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
