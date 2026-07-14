import * as React from "react"
import { Helmet } from "react-helmet-async"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"

export function ClientDashboard() {
  return (
    <>
      <Helmet>
        <title>Painel do Cliente | AngolaStay</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Bem-vindo de volta, João!</h1>
          <p className="text-muted-foreground">Aqui está o resumo das suas atividades e reservas recentes.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">1</div>
              <p className="text-xs text-muted-foreground">Próxima viagem em 12 dias</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Viagens Anteriores</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">3</div>
              <p className="text-xs text-muted-foreground">Última em Benguela</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-4">A sua próxima viagem</h2>
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/3 h-48 sm:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" 
                alt="Hotel" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text">Resort Épico Luanda Sul</h3>
                <p className="text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Talatona, Luanda
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium text-text">12 Fev 2026, 14:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium text-text">15 Fev 2026, 11:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hóspedes</span>
                    <span className="font-medium text-text">2 Adultos</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button className="w-full sm:w-auto">Ver Detalhes</Button>
                <Button variant="outline" className="w-full sm:w-auto text-danger border-danger/30 hover:bg-danger/10 hover:text-danger">
                  Cancelar Reserva
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
