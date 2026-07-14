import * as React from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"

export function Login() {
  return (
    <>
      <Helmet>
        <title>Login | AngolaStay</title>
      </Helmet>
      
      <div className="container relative min-h-[calc(100vh-200px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-primary" />
          {/* Background Image / Brand Area */}
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link to="/" className="text-white text-2xl font-bold">
               Angola<span className="text-secondary">Stay</span>
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "A plataforma mais segura e rápida para encontrar ou anunciar alojamentos em Angola."
              </p>
            </blockquote>
          </div>
        </div>

        <div className="p-4 lg:p-8 flex items-center justify-center">
          <Card className="w-full max-w-[400px] shadow-lg border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Fazer Login</CardTitle>
              <CardDescription>
                Insira o seu email e palavra-passe para entrar na sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="nome@exemplo.com" />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Link
                    to="/auth/recuperar-senha"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Esqueceu-se?
                  </Link>
                </div>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full mt-2">Entrar</Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4">
               <div className="relative w-full">
                 <div className="absolute inset-0 flex items-center">
                   <span className="w-full border-t border-border" />
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-surface px-2 text-muted-foreground">
                     Ou
                   </span>
                 </div>
               </div>
               <div className="text-sm text-center text-muted-foreground">
                 Não tem uma conta?{" "}
                 <Link to="/auth/registo" className="text-primary hover:underline font-medium">
                   Registar-se
                 </Link>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
