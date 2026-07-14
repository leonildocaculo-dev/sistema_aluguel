
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"

import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"
import { registerSchema } from "../../schemas/auth"
import type { RegisterFormValues } from "../../schemas/auth"
import { authService } from "../../services/authService"
import { useAuthStore } from "../../stores/authStore"

export function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false
    }
  })

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data: any) => {
      if (data.user && data.token) {
        setAuth(data.user, data.token)
        if (data.user.role_id === 1) navigate('/admin')
        else if (data.user.role_id === 2) navigate('/owner')
        else navigate('/dashboard')
      }
    },
    onError: (error: any) => {
      console.error("Erro no registo:", error)
    }
  })

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data)
  }

  return (
    <>
      <Helmet>
        <title>Registar | AngolaStay</title>
      </Helmet>
      
      <div className="container relative min-h-[calc(100vh-200px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="text-white text-2xl font-bold">
               Angola<span className="text-secondary">Stay</span>
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Junte-se a nós e tenha acesso às melhores propriedades de Angola."
              </p>
            </blockquote>
          </div>
        </div>

        <div className="p-4 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-[400px] shadow-lg border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para criar a sua conta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="João Silva" 
                    {...formRegister("name")}
                    className={errors.name ? "border-danger" : ""}
                  />
                  {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    {...formRegister("email")}
                    className={errors.email ? "border-danger" : ""}
                  />
                  {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...formRegister("password")}
                    className={errors.password ? "border-danger" : ""}
                  />
                  {errors.password && <span className="text-xs text-danger">{errors.password.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    {...formRegister("confirmPassword")}
                    className={errors.confirmPassword ? "border-danger" : ""}
                  />
                  {errors.confirmPassword && <span className="text-xs text-danger">{errors.confirmPassword.message}</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    {...formRegister("terms")}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os termos e condições
                  </label>
                </div>
                {errors.terms && <span className="text-xs text-danger">{errors.terms.message}</span>}
                <Button type="submit" className="w-full mt-2" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "A criar conta..." : "Criar conta"}
                </Button>
              </CardContent>
            </form>
            <CardFooter className="flex flex-col items-center gap-4">
               <div className="text-sm text-center text-muted-foreground">
                 Já tem uma conta?{" "}
                 <Link to="/auth/login" className="text-primary hover:underline font-medium">
                   Iniciar Sessão
                 </Link>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
