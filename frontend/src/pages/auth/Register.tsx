import * as React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"

export function Register() {
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
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" type="text" placeholder="João Silva" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nome@exemplo.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Palavra-passe</Label>
                <Input id="password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Aceito os termos e condições
                </label>
              </div>
              <Button className="w-full mt-2">Criar conta</Button>
            </CardContent>
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
