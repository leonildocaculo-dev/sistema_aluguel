"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../../components/ui/card";
import { loginSchema } from "../../../schemas/auth";
import type { LoginFormValues } from "../../../schemas/auth";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../stores/authStore";

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      if (data.user && data.token) {
        setAuth(data.user, data.token);
        if (data.user.role_id === 1) router.push('/admin');
        else if (data.user.role_id === 2) router.push('/owner');
        else router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error("Erro no login:", error);
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-muted/20">
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex overflow-hidden shadow-2xl">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
           <video 
             autoPlay 
             muted 
             loop 
             playsInline
             className="w-full h-full object-cover scale-105"
             poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920"
           >
             <source src="https://videos.pexels.com/video-files/4429994/4429994-uhd_2560_1440_24fps.mp4" type="video/mp4" />
           </video>
           <div className="absolute inset-0 bg-primary/80 bg-gradient-to-tr from-primary/95 to-primary/40 mix-blend-multiply" />
           <div className="absolute inset-0 bg-black/10" />
        </div>
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="text-white text-4xl font-bold font-['Outfit'] drop-shadow-xl tracking-tight">
             Angola<span className="text-secondary">Stay</span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-2xl font-bold leading-relaxed drop-shadow-lg text-white/95 max-w-lg">
              "A plataforma mais segura e rápida para encontrar ou anunciar alojamentos em Angola. Reserve com confiança."
            </p>
            <footer className="text-sm text-white/80 font-bold uppercase tracking-widest border-l-2 border-secondary pl-4">Alojamentos Premium</footer>
          </blockquote>
        </div>
      </div>

      <div className="p-4 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-[450px] shadow-2xl border-border/50 rounded-2xl bg-surface/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-text">Fazer Login</CardTitle>
            <CardDescription className="text-base text-muted-foreground font-medium">
              Insira o seu email e palavra-passe para entrar na sua conta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-5">
              <div className="grid gap-2.5">
                <Label htmlFor="email" className="font-bold text-text/90">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nome@exemplo.com" 
                  {...register("email")}
                  className={`h-12 bg-background border-border shadow-sm focus-visible:ring-primary ${errors.email ? "border-danger focus-visible:ring-danger" : ""}`}
                />
                {errors.email && (
                  <span className="text-xs text-danger font-medium">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-bold text-text/90">Palavra-passe</Label>
                  <Link
                    href="/recuperar-senha"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Esqueceu-se?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  {...register("password")}
                  className={`h-12 bg-background border-border shadow-sm focus-visible:ring-primary ${errors.password ? "border-danger focus-visible:ring-danger" : ""}`}
                />
                {errors.password && (
                  <span className="text-xs text-danger font-medium">{errors.password.message}</span>
                )}
              </div>
              <Button type="submit" size="lg" className="w-full mt-4 h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "A entrar..." : "Entrar"}
              </Button>
            </CardContent>
          </form>
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
               <Link href="/registo" className="text-primary hover:underline font-medium">
                 Registar-se
               </Link>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
