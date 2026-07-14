import * as React from "react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 mt-16">
      <div className="container mx-auto max-w-[var(--container-width)] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-text mb-4">Sobre Nós</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Como funciona o AngolaStay</li>
              <li>A nossa missão</li>
              <li>Sustentabilidade</li>
              <li>Carreiras</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-4">Comunidade</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Blog</li>
              <li>Avaliações</li>
              <li>Regras de convivência</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-4">Hospedagem</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Seja um anfitrião</li>
              <li>Recursos para anfitriões</li>
              <li>Fórum da comunidade</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Central de Ajuda</li>
              <li>Opções de cancelamento</li>
              <li>Acessibilidade</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AngolaStay. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-text">Privacidade</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-text">Termos</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-text">Mapa do site</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
