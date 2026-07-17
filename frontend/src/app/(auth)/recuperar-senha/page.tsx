"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { forgotPasswordSchema } from "../../../schemas/auth";
import type { ForgotPasswordFormValues } from "../../../schemas/auth";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isSuccess, setIsSuccess] = React.useState(false);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    console.log("Valores de Recuperação:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuccess(true);
  };

  return (
    <div className="container relative min-h-[calc(100vh-200px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="text-white text-2xl font-bold">
             Angola<span className="text-secondary">Stay</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Segurança em primeiro lugar. Recupere o acesso à sua conta de forma rápida e segura."
            </p>
          </blockquote>
        </div>
      </div>

      <div className="p-4 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-[400px] shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Recuperar Conta</CardTitle>
            <CardDescription>
              {isSuccess 
                ? "Verifique a sua caixa de entrada de email." 
                : "Insira o seu email. Enviaremos um link para redefinir a palavra-passe."}
            </CardDescription>
          </CardHeader>
          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nome@exemplo.com" 
                    {...register("email")}
                    className={errors.email ? "border-danger" : ""}
                  />
                  {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
                </div>
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting ? "A enviar..." : "Enviar link de recuperação"}
                </Button>
              </CardContent>
            </form>
          ) : (
            <CardContent>
              <div className="p-4 bg-success/10 text-success rounded-md text-sm">
                Foi enviado um link de recuperação para o seu email. Por favor verifique a sua caixa de entrada e a pasta de spam.
              </div>
            </CardContent>
          )}
          <CardFooter className="flex flex-col items-center gap-4">
             <div className="text-sm text-center text-muted-foreground">
               Lembrou-se da palavra-passe?{" "}
               <Link href="/login" className="text-primary hover:underline font-medium">
                 Voltar ao Login
               </Link>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
