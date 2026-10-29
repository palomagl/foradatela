'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, Moon, Sun, X, Plus, Bot } from 'lucide-react';
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
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const [expandedScreenshot, setExpandedScreenshot] = useState<number | null>(null);
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
    setExpandedScreenshot(null);
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
          {projects.slice(0, 8).map((project) => (
            <button className="project" key={project.id} aria-label={`Conhecer ${project.name}`}
              onClick={(event) => { trigger.current = event.currentTarget; setExpandedScreenshot(null); setSelected(project); }}>
              <span className={`app-icon ${project.icon ? '' : 'empty-icon liquid-glass'}`}>
                {project.icon
                  ? <img src={project.icon} alt="" width={96} height={96} draggable={false} />
                  : <Plus size={28} strokeWidth={1} />}
              </span>
              <span className="project-name">{project.name}</span>
            </button>
          ))}
          <button className="project more-projects" aria-expanded={showMoreProjects} aria-controls="additional-projects"
            onClick={() => setShowMoreProjects(value => !value)}>
            <span className="app-icon empty-icon liquid-glass">
              <Plus size={28} strokeWidth={1.2} className={showMoreProjects ? 'more-icon-open' : ''} />
            </span>
            <span className="project-name">{showMoreProjects ? 'Ver menos' : 'Ver mais projetos'}</span>
          </button>
        </section>
        {showMoreProjects && (
          <section id="additional-projects" className="project-grid grid grid-cols-3 extra-projects" aria-label="Mais projetos">
            {projects.slice(8).map((project) => (
              <button className="project" key={project.id} aria-label={`Conhecer ${project.name}`}
                onClick={(event) => { trigger.current = event.currentTarget; setExpandedScreenshot(null); setSelected(project); }}>
                <span className={`app-icon ${project.icon ? '' : 'empty-icon liquid-glass'}`}>
                  {project.icon ? <img src={project.icon} alt="" width={96} height={96} draggable={false} /> : <Plus size={28} strokeWidth={1} />}
                </span>
                <span className="project-name">{project.name}</span>
              </button>
            ))}
          </section>
        )}

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
        onCancel={(event) => { event.preventDefault(); if (expandedScreenshot !== null) setExpandedScreenshot(null); else close(); }}
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          const rect = dialog.current.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
        }}>
        {selected && (
          <article className={`panel panel-${selected.id}`}>
            <div className="handle" aria-hidden="true" />
            <button className="close" onClick={close} aria-label="Fechar projeto"><X size={23} strokeWidth={1.6} /></button>
            <div className="panel-scroll">
            <div className="panel-heading flex items-center">
              {selected.icon && <img className="panel-icon" src={selected.icon} alt="" width={80} height={80} />}
              <div><h2 id="project-title">{selected.name}</h2><p>{details[selected.id]?.subtitle}</p></div>
            </div>
            <h3>{selected.headline || (selected.url ? `Explore ${selected.name}.` : 'Novidades em breve.')}</h3>
            {details[selected.id]?.description && <p className="project-description">{details[selected.id].description}</p>}

            {selected.id === 'rotina' && (
              <div className="telegram-flow" aria-label="Demonstração animada: mensagem enviada no Telegram, resposta do bot e gasto registrado no Minha Rotina">
                <div className="telegram-example-label">ASSIM FUNCIONA</div>
                <div className="telegram-chat">
                  <div className="telegram-message">
                    <span>Gastei R$ 35 no mercado</span>
                    <span className="telegram-check" aria-label="Mensagem enviada">✓✓</span>
                  </div>
                  <div className="telegram-bot-message">
                    <span className="telegram-bot-icon" aria-hidden="true"><Bot size={19} strokeWidth={2} /></span>
                    <span>Conta adicionada no app <span aria-hidden="true">✓</span></span>
                  </div>
                  <div className="telegram-entry">
                    <span className="telegram-entry-icon" aria-hidden="true">🛒</span>
                    <span className="telegram-entry-info"><strong>Mercado</strong><small>Despesa registrada</small></span>
                    <strong className="telegram-entry-value">− R$ 35,00</strong>
                  </div>
                </div>
              </div>
            )}

            {selected.showcase ? (
              <button type="button" className="project-showcase" onClick={() => setExpandedScreenshot(-1)}
                aria-label={`Ampliar apresentação de ${selected.name}`}>
                <img src={selected.showcase} width={900} height={675} loading="eager" decoding="async"
                  alt={`Apresentação de ${selected.name} com duas telas reais do aplicativo`} />
              </button>
            ) : (
            <div className="gallery gallery-dual" aria-label={`Telas de ${selected.name}`}>
              {[0, 1].map((index) => selected.screenshots[index] ? (
                <button type="button" className={`phone-preview dual-phone dual-phone-${index + 1}`}
                  key={index} onClick={() => setExpandedScreenshot(index)}
                  aria-label={`Ampliar tela ${index + 1} de ${selected.name}`}>
                  <img src={selected.screenshots[index]}
                    alt={`Captura real ${index + 1} de ${selected.name}`}
                    width={390} height={844} decoding="async" />
                </button>
              ) : (
                <div className={`phone-preview dual-phone dual-phone-${index + 1}`} key={index}>
                  <div className="phone-pending"><span>Em breve</span><small>Prévia em preparação</small></div>
                </div>
              ))}
            </div>
            )}
            {selected.showcase ? <p className="gallery-hint">Toque na imagem para ampliar</p> : selected.screenshots.length > 0 && (
              <p className="gallery-hint">Toque nas telas para ampliar</p>
            )}
            </div>
            <div className="panel-actions">
            {selected.url ? (
              <a className="cta flex items-center justify-center" href={selected.url} target="_blank" rel="noopener noreferrer">
                {selected.id === 'stopou' ? 'Jogar agora' : selected.id === 'karoane' ? 'Explorar loja' : 'Explorar projeto'}
                <ArrowUpRight size={20} />
              </a>
            ) : <div className="unavailable">Projeto em preparação</div>}
            </div>
            {expandedScreenshot === -1 && selected.showcase && (
              <div className="showcase-lightbox" role="region" aria-label={`Apresentação ampliada de ${selected.name}`}>
                <div className="screenshot-lightbox-header">
                  <span>{selected.name} · Apresentação</span>
                  <button type="button" onClick={() => setExpandedScreenshot(null)}
                    aria-label="Fechar imagem ampliada"><X size={22} /></button>
                </div>
                <img src={selected.showcase} width={900} height={675}
                  alt={`Apresentação ampliada de ${selected.name}`} />
              </div>
            )}
            {expandedScreenshot !== null && selected.screenshots[expandedScreenshot] && (
              <div className="screenshot-lightbox" role="region" aria-label={`Tela ampliada de ${selected.name}`}>
                <div className="screenshot-lightbox-header">
                  <span>{selected.name} · Tela {expandedScreenshot + 1}</span>
                  <button type="button" onClick={() => setExpandedScreenshot(null)}
                    aria-label="Fechar imagem ampliada"><X size={22} /></button>
                </div>
                <img src={selected.screenshots[expandedScreenshot]}
                  alt={`Tela ampliada de ${selected.name}`} />
                <div className="screenshot-lightbox-tabs">
                  {selected.screenshots.map((_, index) => (
                    <button type="button" key={index}
                      aria-pressed={expandedScreenshot === index}
                      onClick={() => setExpandedScreenshot(index)}>Tela {index + 1}</button>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </dialog>
    </main>
  );
}
