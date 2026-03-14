import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Header } from "../../../shared/header/header";
import { CommonModule } from '@angular/common';
import { CoursesPopularCardComponent } from "../../dashboard/dashboard.component/courses-popular-card/courses-popular-card.component";

@Component({
  selector: 'app-home.page',
  standalone: true,
  imports: [
    RouterLink,
    Header,
    CommonModule,
    CoursesPopularCardComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {

  stats = [
    { label: 'Estudantes Ativos', value: '10k+' },
    { label: 'Mentores Expert', value: '100+' },
    { label: 'Cursos', value: '50+' },
    { label: 'Satisfação', value: '4.9/5' }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer no Spotify',
      quote: 'A melhor decisão da minha carreira.',
      content: 'A didática é impecável. Consegui sair do zero ao meu primeiro emprego internacional em menos de 8 meses focando apenas nos projetos práticos.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Michael Chen',
      role: 'Engenheiro de Software no Nubank',
      quote: 'Foco totalmente resolvido no mercado.',
      content: 'Não perdi tempo com teorias vazias. Tudo o que aprendi no ecossistema foi direto para meu portfólio, garantindo minha aprovação técnica.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      name: 'Emily Davis',
      role: 'Tech Lead no Google',
      quote: 'O padrão ouro da educação online.',
      content: 'O nível de profundidade técnica é o maior que já vi. Hoje exijo que todo o meu time júnior estude por aqui para acelerar a rampa técnica.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];

  faqs = [
    {
      question: 'Preciso ter cartão de crédito para iniciar o teste?',
      answer: 'Sim, solicitamos o cartão para evitar abusos no sistema de trial, mas você não será cobrado se cancelar antes dos 14 dias.'
    },
    {
      question: 'Consigo cancelar a qualquer momento?',
      answer: 'Com certeza. O cancelamento pode ser feito com 1 clique diretamente no painel de configurações da sua conta, sem precisar falar com atendentes.'
    },
    {
      question: 'Os cursos oferecem certificado de conclusão?',
      answer: 'Sim! Todos os cursos e trilhas fornecem certificados com autenticação digital válidos em todo o território nacional.'
    },
    {
      question: 'Qual o nível de conhecimento prévio necessário?',
      answer: 'A plataforma atende desde iniciantes absolutos até profissionais seniores. As trilhas são divididas por nível de dificuldade para guiar seu progresso.'
    },
    {
      question: 'O suporte técnico funciona aos finais de semana?',
      answer: 'Nossos fóruns da comunidade e suporte técnico estão disponíveis 24/7. Respostas dos mentores oficiais ocorrem em dias úteis.'
    },
    {
      question: 'Quanto tempo tenho de acesso aos cursos?',
      answer: 'O acesso é ilimitado enquanto sua assinatura estiver ativa. Você pode assistir às aulas quantas vezes quiser e no seu próprio ritmo.'
    },
    {
      question: 'Existem projetos práticos no currículo?',
      answer: 'Sim, a nossa metodologia é focada em projetos. Ao invés de apenas assistir aulas, você vai construir aplicações reais para o seu portfólio, ganhando experiência prática.'
    },
    {
      question: 'Posso acessar a plataforma pelo celular?',
      answer: 'Sim! Nossa plataforma é totalmente responsiva e pode ser acessada de qualquer dispositivo, seja computador, tablet ou smartphone.'
    },
    {
      question: 'As aulas são gravadas ou ao vivo?',
      answer: 'Todas as aulas são pré-gravadas, garantindo alta qualidade audiovisual e permitindo que você estude no horário que for melhor para você. Ocasionalmente, promovemos masterclasses ao vivo.'
    },
    {
      question: 'É possível baixar as aulas para assistir offline?',
      answer: 'Atualmente, nossa plataforma exige conexão à internet para acessar os vídeos. Porém, todos os materiais de apoio e códigos podem ser baixados em sua máquina.'
    }
  ];

  openFaqs = new Set<number>();

  toggleFaq(index: number): void {
    if (this.openFaqs.has(index)) {
      this.openFaqs.delete(index);
    } else {
      this.openFaqs.add(index);
    }
  }

  isFaqOpen(index: number): boolean {
    return this.openFaqs.has(index);
  }
}
