"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Info, Shield, Users, BookOpen } from 'lucide-react';

const contentData: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
  "como-funciona": {
    title: "Como funciona o AngolaStay",
    icon: <Info className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Bem-vindo à AngolaStay! A nossa plataforma liga anfitriões que possuem alojamentos extraordinários a viajantes que procuram estadias inesquecíveis em Angola.</p>
        <h3 className="text-xl font-bold text-text mt-8 mb-4">Para Hóspedes</h3>
        <ul className="space-y-3">
          <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5" /> <span>Pesquise o destino pretendido usando a nossa barra de navegação inteligente.</span></li>
          <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5" /> <span>Filtre as opções por preço, tipo de quarto, ou localização (ex: Luanda, Benguela).</span></li>
          <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-primary mr-3 mt-0.5" /> <span>Realize o pagamento seguro via Multicaixa ou Transferência para garantir a reserva.</span></li>
        </ul>
      </div>
    )
  },
  "missao": {
    title: "A nossa missão",
    icon: <Shield className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>A missão da AngolaStay é democratizar e modernizar o acesso ao turismo e imobiliário em Angola, providenciando uma infraestrutura digital segura, fiável e esteticamente agradável.</p>
        <p>Queremos mostrar o que Angola tem de melhor: as paisagens, a cultura e a hospitalidade do nosso povo.</p>
      </div>
    )
  },
  "sustentabilidade": {
    title: "Sustentabilidade",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Acreditamos num turismo que respeita o meio ambiente. Encorajamos os nossos anfitriões a adotarem práticas sustentáveis, como a redução do uso de plásticos e a eficiência energética.</p>
      </div>
    )
  },
  "carreiras": {
    title: "Carreiras",
    icon: <Users className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Junta-te a uma equipa jovem e dinâmica que está a revolucionar o mercado de alojamentos em Angola!</p>
        <p className="font-semibold text-text">Vagas abertas atualmente:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Engenheiro de Software Frontend (React/Next.js) - Luanda</li>
          <li>Especialista em Suporte ao Cliente - Remoto</li>
          <li>Gestor de Contas de Anfitriões - Benguela</li>
        </ul>
        <p className="mt-8 text-sm">Envia o teu CV para <span className="text-primary font-bold">rh@angolastay.com</span></p>
      </div>
    )
  },
  "blog": {
    title: "Blog",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>O blog oficial da AngolaStay. Descubra guias de viagens, dicas para anfitriões e as últimas novidades sobre o turismo em Angola.</p>
        <div className="p-8 bg-muted rounded-xl text-center border border-border mt-8">
          <p className="text-lg font-medium text-text">Novos artigos em breve!</p>
        </div>
      </div>
    )
  },
  "avaliacoes": {
    title: "Avaliações",
    icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>A confiança é a base da nossa comunidade. Todas as avaliações na AngolaStay são de hóspedes reais que efetuaram reservas reais através da nossa plataforma.</p>
      </div>
    )
  },
  "regras-convivencia": {
    title: "Regras de convivência",
    icon: <Shield className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Para garantir que todos desfrutam das suas estadias, estabelecemos regras básicas:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respeito mútuo entre hóspede e anfitrião.</li>
          <li>Cuidado com o património e instalações.</li>
          <li>Cumprimento rigoroso dos horários de check-in e check-out.</li>
        </ul>
      </div>
    )
  },
  "seja-anfitriao": {
    title: "Seja um anfitrião",
    icon: <Users className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Transforme o seu espaço vazio numa fonte de rendimento! É gratuito anunciar a sua propriedade na AngolaStay.</p>
        <p>Damos-lhe todas as ferramentas necessárias para gerir o calendário, preços e comunicação com os hóspedes.</p>
      </div>
    )
  },
  "recursos-anfitriao": {
    title: "Recursos para anfitriões",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Encontre guias sobre como tirar as melhores fotos, como precificar a sua casa em época alta (festas de Luanda, Carnaval de Benguela) e muito mais.</p>
      </div>
    )
  },
  "forum": {
    title: "Fórum da comunidade",
    icon: <Users className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Participe em discussões com outros anfitriões e hóspedes. Troque experiências e dicas vitais.</p>
        <div className="p-8 bg-muted rounded-xl text-center border border-border mt-8">
          <p className="text-lg font-medium text-text">Fórum em fase de testes beta. Lançamento em breve.</p>
        </div>
      </div>
    )
  },
  "central-ajuda": {
    title: "Central de Ajuda",
    icon: <Info className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Precisa de assistência com a sua reserva ou conta? A nossa equipa está pronta para ajudar 24 horas por dia.</p>
        <p className="font-semibold text-text">Contactos:</p>
        <ul className="space-y-2">
          <li>Email: suporte@angolastay.com</li>
          <li>Telefone: +244 999 999 999</li>
        </ul>
      </div>
    )
  },
  "opcoes-cancelamento": {
    title: "Opções de cancelamento",
    icon: <Shield className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>A AngolaStay compreende que imprevistos acontecem. As nossas políticas de cancelamento protegem tanto o hóspede como o anfitrião.</p>
        <p>Consulte sempre a política de cancelamento específica do alojamento no momento da reserva (Flexível, Moderada ou Rigorosa).</p>
      </div>
    )
  },
  "acessibilidade": {
    title: "Acessibilidade",
    icon: <Users className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Estamos comprometidos em tornar a nossa plataforma utilizável e acessível a todas as pessoas, incluindo indivíduos com deficiências visuais ou motoras.</p>
      </div>
    )
  },
  "privacidade": {
    title: "Política de Privacidade",
    icon: <Shield className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Em conformidade com a Lei Angolana de Proteção de Dados (Lei n.º 22/11), a sua privacidade é a nossa prioridade.</p>
        <p>Os seus dados são encriptados (Argon2id) e nunca serão partilhados com terceiros sem o seu consentimento explícito.</p>
      </div>
    )
  },
  "termos": {
    title: "Termos e Condições",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Ao utilizar a plataforma AngolaStay, concorda com os nossos Termos de Serviço.</p>
        <p>As reservas são processadas digitalmente e assumem um carácter contratual legal entre o Hóspede e o Anfitrião.</p>
      </div>
    )
  },
  "mapa-site": {
    title: "Mapa do Site",
    icon: <Info className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Descubra todas as páginas da nossa plataforma:</p>
        <ul className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <li>Página Inicial</li>
          <li>Pesquisa de Imóveis</li>
          <li>Painel do Utilizador</li>
          <li>Sobre Nós</li>
          <li>Suporte</li>
        </ul>
      </div>
    )
  }
};

export function InfoClient({ slug }: { slug: string }) {
  const router = useRouter();
  const data = contentData[slug] || {
    title: "Página não encontrada",
    icon: <Info className="w-8 h-8 text-red-500" />,
    content: <p className="text-muted-foreground">A informação que procura não existe ou foi movida.</p>
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Decorative Header */}
      <div className="w-full bg-surface border-b border-border/50 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
           <button 
             onClick={() => router.back()} 
             className="flex items-center text-muted-foreground hover:text-text mb-8 transition-colors font-medium group"
           >
             <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
           </button>
           <div className="flex items-center space-x-4">
              <div className="p-4 bg-background border border-border/50 rounded-2xl shadow-lg">
                 {data.icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-text tracking-tight font-['Outfit']">
                {data.title}
              </h1>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-4xl px-4 mt-12">
        <div className="bg-surface border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-xl">
           <div className="prose prose-slate max-w-none prose-p:text-lg prose-p:text-muted-foreground prose-headings:text-text prose-a:text-primary prose-strong:text-text">
              {data.content}
           </div>
        </div>

        {/* Footer Prompt */}
        <div className="mt-12 text-center">
           <p className="text-muted-foreground">
             Ainda tem dúvidas? <span className="text-primary font-bold cursor-pointer hover:underline">Contacte a nossa equipa de Suporte</span>
           </p>
        </div>
      </div>
    </div>
  );
}
