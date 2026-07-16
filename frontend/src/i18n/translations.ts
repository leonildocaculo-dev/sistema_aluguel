export type Locale = 'pt' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  pt: {
    // Header
    'header.register': 'Registar',
    'header.login': 'Fazer login',
    'header.panel': 'Painel',
    'header.logout': 'Sair',
    'header.hello': 'Olá',
    'header.loggedAs': 'Logado como',
    'header.myPanel': 'Meu Painel',
    'header.logoutAccount': 'Sair da conta',
    'header.createAccount': 'Criar conta',
    'header.langLabel': 'PT - AOA',

    // Hero
    'hero.title': 'Encontre o Alojamento Perfeito em Angola',
    'hero.subtitle': 'Reserve diretamente com os proprietários. Hotéis de luxo, resorts de praia e retiros naturais.',

    // Search Bar
    'search.location': 'Localização',
    'search.locationPlaceholder': 'Para onde vai?',
    'search.dates': 'Datas',
    'search.addDates': 'Adicionar datas',
    'search.guests': 'Hóspedes',
    'search.addGuests': 'Adicionar hóspedes',
    'search.button': 'Pesquisar',
    'search.adults': 'Adultos',
    'search.children': 'Crianças',
    'search.config': 'Configuração',
    'search.configDesc': 'Selecione o número de hóspedes.',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guest': 'hóspede',
    'search.guestsLabel': 'hóspedes',

    // Benefits
    'benefits.secure.title': 'Reserva Segura',
    'benefits.secure.desc': 'Pagamentos encriptados e suporte dedicado 24/7 para garantir a sua tranquilidade.',
    'benefits.quality.title': 'Qualidade Premium',
    'benefits.quality.desc': 'Alojamentos rigorosamente selecionados e validados pela nossa equipa de especialistas.',
    'benefits.destinations.title': 'Melhores Destinos',
    'benefits.destinations.desc': 'Descubra lugares incríveis de Cabinda ao Cunene, com experiências autênticas.',

    // Promo
    'promo.badge': 'Vantagem AngolaStay',
    'promo.title': 'Sem intermediários.',
    'promo.title2': 'Apenas grandes estadias.',
    'promo.desc': 'Ao reservar através do AngolaStay, garante uma comunicação direta com o anfitrião e usufrui das melhores tarifas disponíveis no mercado, apoiando o turismo local.',
    'promo.button': 'Explorar Propriedades',

    // Featured
    'featured.title': 'Alojamentos em Destaque',
    'featured.subtitle': 'Propriedades altamente recomendadas pelos nossos hóspedes em Angola.',
    'featured.viewAll': 'Ver todas',
    'featured.allProvinces': 'Todas as províncias',

    // Property Card
    'card.pricePerNight': 'Preço por noite',
    'card.viewDetails': 'Ver detalhes',

    // Footer
    'footer.aboutUs': 'Sobre Nós',
    'footer.howItWorks': 'Como funciona o AngolaStay',
    'footer.mission': 'A nossa missão',
    'footer.sustainability': 'Sustentabilidade',
    'footer.careers': 'Carreiras',
    'footer.community': 'Comunidade',
    'footer.blog': 'Blog',
    'footer.reviews': 'Avaliações',
    'footer.rules': 'Regras de convivência',
    'footer.hosting': 'Hospedagem',
    'footer.becomeHost': 'Seja um anfitrião',
    'footer.hostResources': 'Recursos para anfitriões',
    'footer.communityForum': 'Fórum da comunidade',
    'footer.support': 'Suporte',
    'footer.helpCenter': 'Central de Ajuda',
    'footer.cancellation': 'Opções de cancelamento',
    'footer.accessibility': 'Acessibilidade',
    'footer.copyright': 'AngolaStay. Todos os direitos reservados.',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos',
    'footer.sitemap': 'Mapa do site',

    // Search Results
    'results.found': 'alojamentos encontrados',
    'results.sortBy': 'Ordenar por:',
    'results.recommended': 'Recomendado',
    'results.priceLow': 'Preço (Mais baixo primeiro)',
    'results.priceHigh': 'Preço (Mais alto primeiro)',
    'results.bestRated': 'Melhor avaliação',
    'results.loadMore': 'Carregar mais resultados',
    'results.filters': 'Filtros',
    'results.priceNight': 'Preço por noite',
    'results.propertyType': 'Tipo de Alojamento',
    'results.amenities': 'Comodidades Populares',
    'results.clearFilters': 'Limpar Filtros',

    // Dashboard
    'dashboard.welcome': 'Bem-vindo de volta!',
    'dashboard.summary': 'Aqui está o resumo das suas atividades e reservas recentes.',
    'dashboard.activeReservations': 'Reservas Ativas',
    'dashboard.nextTrip': 'Próxima viagem em',
    'dashboard.days': 'dias',
    'dashboard.pastTrips': 'Viagens Anteriores',
    'dashboard.lastIn': 'Última em',
    'dashboard.yourNextTrip': 'A sua próxima viagem',
    'dashboard.viewDetails': 'Ver Detalhes',
    'dashboard.cancelReservation': 'Cancelar Reserva',
    'dashboard.noReservations': 'Ainda não tem reservas. Explore os nossos alojamentos!',
    'dashboard.explore': 'Explorar Alojamentos',

    // Info Pages
    'info.back': 'Voltar',
    'info.contactSupport': 'Contacte a nossa equipa de Suporte',
    'info.moreQuestions': 'Ainda tem dúvidas?',
  },
  en: {
    // Header
    'header.register': 'Register',
    'header.login': 'Sign in',
    'header.panel': 'Dashboard',
    'header.logout': 'Sign out',
    'header.hello': 'Hello',
    'header.loggedAs': 'Logged in as',
    'header.myPanel': 'My Dashboard',
    'header.logoutAccount': 'Sign out',
    'header.createAccount': 'Create account',
    'header.langLabel': 'EN - USD',

    // Hero
    'hero.title': 'Find the Perfect Stay in Angola',
    'hero.subtitle': 'Book directly with property owners. Luxury hotels, beach resorts and nature retreats.',

    // Search Bar
    'search.location': 'Location',
    'search.locationPlaceholder': 'Where are you going?',
    'search.dates': 'Dates',
    'search.addDates': 'Add dates',
    'search.guests': 'Guests',
    'search.addGuests': 'Add guests',
    'search.button': 'Search',
    'search.adults': 'Adults',
    'search.children': 'Children',
    'search.config': 'Configuration',
    'search.configDesc': 'Select the number of guests.',
    'search.checkin': 'Check-in',
    'search.checkout': 'Check-out',
    'search.guest': 'guest',
    'search.guestsLabel': 'guests',

    // Benefits
    'benefits.secure.title': 'Secure Booking',
    'benefits.secure.desc': 'Encrypted payments and dedicated 24/7 support for your peace of mind.',
    'benefits.quality.title': 'Premium Quality',
    'benefits.quality.desc': 'Accommodations rigorously selected and validated by our team of experts.',
    'benefits.destinations.title': 'Best Destinations',
    'benefits.destinations.desc': 'Discover amazing places from Cabinda to Cunene, with authentic experiences.',

    // Promo
    'promo.badge': 'AngolaStay Advantage',
    'promo.title': 'No middlemen.',
    'promo.title2': 'Just great stays.',
    'promo.desc': 'By booking through AngolaStay, you get direct communication with the host and enjoy the best rates available on the market, supporting local tourism.',
    'promo.button': 'Explore Properties',

    // Featured
    'featured.title': 'Featured Accommodations',
    'featured.subtitle': 'Highly recommended properties by our guests in Angola.',
    'featured.viewAll': 'View all',
    'featured.allProvinces': 'All provinces',

    // Property Card
    'card.pricePerNight': 'Price per night',
    'card.viewDetails': 'View details',

    // Footer
    'footer.aboutUs': 'About Us',
    'footer.howItWorks': 'How AngolaStay works',
    'footer.mission': 'Our mission',
    'footer.sustainability': 'Sustainability',
    'footer.careers': 'Careers',
    'footer.community': 'Community',
    'footer.blog': 'Blog',
    'footer.reviews': 'Reviews',
    'footer.rules': 'Community guidelines',
    'footer.hosting': 'Hosting',
    'footer.becomeHost': 'Become a host',
    'footer.hostResources': 'Host resources',
    'footer.communityForum': 'Community forum',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.cancellation': 'Cancellation options',
    'footer.accessibility': 'Accessibility',
    'footer.copyright': 'AngolaStay. All rights reserved.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.sitemap': 'Sitemap',

    // Search Results
    'results.found': 'accommodations found',
    'results.sortBy': 'Sort by:',
    'results.recommended': 'Recommended',
    'results.priceLow': 'Price (Lowest first)',
    'results.priceHigh': 'Price (Highest first)',
    'results.bestRated': 'Best rated',
    'results.loadMore': 'Load more results',
    'results.filters': 'Filters',
    'results.priceNight': 'Price per night',
    'results.propertyType': 'Property Type',
    'results.amenities': 'Popular Amenities',
    'results.clearFilters': 'Clear Filters',

    // Dashboard
    'dashboard.welcome': 'Welcome back!',
    'dashboard.summary': 'Here is a summary of your recent activities and bookings.',
    'dashboard.activeReservations': 'Active Bookings',
    'dashboard.nextTrip': 'Next trip in',
    'dashboard.days': 'days',
    'dashboard.pastTrips': 'Past Trips',
    'dashboard.lastIn': 'Last in',
    'dashboard.yourNextTrip': 'Your next trip',
    'dashboard.viewDetails': 'View Details',
    'dashboard.cancelReservation': 'Cancel Booking',
    'dashboard.noReservations': 'No bookings yet. Explore our accommodations!',
    'dashboard.explore': 'Explore Accommodations',

    // Info Pages
    'info.back': 'Back',
    'info.contactSupport': 'Contact our Support team',
    'info.moreQuestions': 'Still have questions?',
  }
};

export default translations;
