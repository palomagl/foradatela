'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, Moon, Sun, X, Plus } from 'lucide-react';
import { Github, Linkedin } from '@/components/social-icons';
import { projects, profile, type Project } from '@/lib/projects';
import { LiquidGlassScene } from '@/components/liquid-glass-scene';

const details: Record<string, { subtitle: string; description: string }> = {
  stopou: { subtitle: 'Jogo de palavras · Multiplayer', description: 'Crie uma sala, compartilhe o código com seus amigos e joguem Stop juntos, cada um do seu celular.' },
  ritimo: { subtitle: 'Alimentação · IA', description: 'Tirou foto do prato? A inteligência artificial estima as calorias da refeição e te ajuda a acompanhar a alimentação de forma prática.' },
  rotina: { subtitle: 'Organização · Telegram', description: 'Anote seus gastos enviando uma mensagem ao bot no Telegram. Eles entram no aplicativo, junto com suas tarefas, hábitos e metas.' },
  karoane: { subtitle: 'E-commerce · Papelaria e bazar', description: 'Uma loja virtual com catálogo para clientes e painel para cadastrar produtos, administrar a vitrine e receber pedidos de orçamento de empresas.' },
  financas: { subtitle: 'Finanças pessoais', description: 'Um jeito simples e intuitivo de organizar o dinheiro, registrar movimentações e acompanhar suas finanças sem complicação.' },
  doe: { subtitle: 'Doação de sangue · RS', description: 'Encontre pontos de coleta próximos, acompanhe suas doações e tenha sua carteirinha de doador em um só lugar.' },
  bruto: { subtitle: 'Hamburgueria · Demonstração', description: 'Uma experiência digital de hamburgueria: explore o cardápio, escolha produtos e conheça o fluxo de pedidos. Demonstração sem venda real.' },
  barbearia: { subtitle: 'Agendamento de serviços', description: 'Uma experiência de agendamento para conhecer serviços e escolher horários em uma barbearia. Projeto em preparação.' },
  vertice: { subtitle: 'Marmoraria · Projeto 3D', description: 'Uma vitrine digital para visualizar projetos de marmoraria e explorar opções de orçamento. Projeto em preparação.' },
};

type Theme = 'system' | 'light' | 'dark';

export default function Home() {
  const [theme, setTheme] = useState<Theme>('system');
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch { /* Follow the system when storage is unavailable. */ }
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!selected || !element) return;
    if (!element.open) element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected]);

  function changeTheme() {
    const active = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;
    const next = active === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem('theme', next); } catch { /* Theme works without persistence. */ }
  }

  function close() {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  }

  const socials = [
    { name: 'GitHub', href: profile.github, Icon: Github },
    { name: 'LinkedIn', href: profile.linkedin, Icon: Linkedin },
    ...(profile.email ? [{ name: 'E-mail', href: `mailto:${profile.email}`, Icon: Mail }] : []),
  ];

  return (
    <main className="universe relative isolate min-h-svh" data-panel-open={selected ? 'true' : 'false'}>
      <div className="fluid-scene" aria-hidden="true"><span className="fluid-blob blob-one" /><span className="fluid-blob blob-two" /><span className="fluid-blob blob-three" /><LiquidGlassScene /></div>
      <div className="home-screen mx-auto flex min-h-svh w-full flex-col">
        <header className="screen-header flex justify-end">
          <div className="site-brand"><h1>fora da tela<span>.</span></h1><p>Projetos que saem do papel.</p></div>
          <button className="theme-switch liquid-glass" onClick={changeTheme}
            aria-label="Alternar tema claro e escuro"
            title="Alternar tema">
            <Sun className="theme-sun" size={20} strokeWidth={1.8} />
            <Moon className="theme-moon" size={20} strokeWidth={1.8} />
          </button>
        </header>

        <section id="projects" className="project-grid grid grid-cols-3" aria-label="Projetos">
          {projects.map((project) => (
            <button className="project" key={project.id} aria-label={`Conhecer ${project.name}`}
              onClick={(event) => { trigger.current = event.currentTarget; setSelected(project); }}>
              <span className={`app-icon ${project.icon ? '' : 'empty-icon liquid-glass'}`}>
                {project.icon
                  ? <img src={project.icon} alt="" width={96} height={96} draggable={false} />
                  : <Plus size={28} strokeWidth={1} />}
              </span>
              <span className="project-name">{project.name}</span>
            </button>
          ))}
        </section>

        <footer className="screen-footer">
          <nav className="dock liquid-glass flex items-center justify-around" aria-label="Redes e contato">
            {socials.map(({ name, href, Icon }) => href ? (
              <a className="dock-item" key={name} href={href} target={name === 'E-mail' ? undefined : '_blank'}
                rel="noopener noreferrer" aria-label={name}><Icon size={28} /></a>
            ) : (
              <button className="dock-item" key={name} disabled aria-label={`${name}: contato em breve`}
                title={`${name}: contato em breve`}><Icon size={28} /></button>
            ))}
          </nav>
        </footer>
      </div>

      <dialog ref={dialog} className="project-dialog liquid-glass" aria-labelledby="project-title"
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          const rect = dialog.current.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }}>
        {selected && (
          <article className={`panel panel-${selected.id}`}>
            <div className="handle" aria-hidden="true" />
            <button className="close" onClick={close} aria-label="Fechar projeto"><X size={23} strokeWidth={1.6} /></button>
            <div className="panel-heading flex items-center">
              {selected.icon && <img className="panel-icon" src={selected.icon} alt="" width={80} height={80} />}
              <div><h2 id="project-title">{selected.name}</h2><p>{details[selected.id]?.subtitle}</p></div>
            </div>
            <h3>{selected.headline || (selected.url ? `Explore ${selected.name}.` : 'Novidades em breve.')}</h3>
            {details[selected.id]?.description && <p className="project-description">{details[selected.id].description}</p>}

            {selected.id === 'rotina' && (
              <div className="telegram-flow" aria-label="Exemplo ilustrativo do registro de gastos pelo Telegram">
                <div className="telegram-example-label">COMO FUNCIONA · EXEMPLO</div>
                <div className="telegram-message">
                  <span className="telegram-mark" aria-hidden="true">➤</span>
                  <span>Gastei R$ 35 no mercado</span>
                  <span className="telegram-check" aria-hidden="true">✓✓</span>
                </div>
                <div className="telegram-result">
                  <span aria-hidden="true" className="telegram-sync">↓</span>
                  <span><strong>Gasto registrado</strong><small>Sincronizado com Minha Rotina</small></span>
                  <span className="telegram-done" aria-hidden="true">✓</span>
                </div>
              </div>
            )}

            <div className="gallery gallery-dual" aria-label={`Prévia de ${selected.name} em celulares`}>
              {[0, 1].map((index) => (
                <div className={`phone-preview dual-phone dual-phone-${index + 1}`} key={index}>
                  
                  {selected.screenshots[index] ? (
                    <img src={selected.screenshots[index]} alt={`Captura real ${index + 1} de ${selected.name}`} width={390} height={844} />
                  ) : (
                    <div className="phone-pending"><span>Prévia</span><small>aguardando captura real</small></div>
                  )}
                </div>
              ))}
            </div>

            {selected.url ? (
              <a className="cta flex items-center justify-center" href={selected.url} target="_blank" rel="noopener noreferrer">
                {selected.id === 'stopou' ? 'Jogar agora' : selected.id === 'karoane' ? 'Explorar loja' : 'Explorar projeto'}
                <ArrowUpRight size={20} />
              </a>
            ) : <div className="unavailable">Link disponível em breve</div>}
          </article>
        )}
      </dialog>
    </main>
  );
}
