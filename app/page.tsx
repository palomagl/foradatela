'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, Moon, Sun, X, Plus } from 'lucide-react';
import { Github, Linkedin } from '@/components/social-icons';
import { projects, profile, type Project } from '@/lib/projects';

const details: Record<string, { subtitle: string; description: string }> = {
  stopou: { subtitle: 'Jogo de palavras · Multiplayer', description: 'O clássico jogo de Stop em versão digital. Reúna os amigos, escolha as categorias e desafie todo mundo em tempo real.' },
  ritimo: { subtitle: 'Aplicativo · Ritmo', description: 'Conheça o Ritmo e explore a experiência diretamente no aplicativo. Novas capturas reais serão adicionadas à apresentação.' },
  rotina: { subtitle: 'Organização pessoal', description: 'Organize tarefas, acompanhe hábitos e planeje suas metas em um espaço pensado para o seu dia a dia.' },
  karoane: { subtitle: 'E-commerce · Papelaria e Bazar', description: 'Papelaria, bazar e muito mais. Explore um catálogo digital com uma experiência pensada para o celular.' },
  financas: { subtitle: 'Finanças pessoais', description: 'Registre seus gastos, acompanhe suas movimentações e tenha uma visão mais clara do seu dinheiro.' },
  doe: { subtitle: 'Doação de sangue · Rio Grande do Sul', description: 'Encontre hemocentros, confira informações sobre doação de sangue e acompanhe sua jornada como doador.' },
  bruto: { subtitle: 'Delivery · Demonstração', description: 'Explore o cardápio e a experiência de pedidos de uma hamburgueria digital. Este projeto é uma demonstração, sem pedidos reais.' },
  barbearia: { subtitle: 'Agendamento de serviços', description: 'Uma experiência de agendamento para conhecer serviços e escolher horários em uma barbearia. Projeto em preparação.' },
  vertice: { subtitle: 'Marmoraria · Projeto 3D', description: 'Uma vitrine digital para visualizar projetos de marmoraria e explorar opções de orçamento. Projeto em preparação.' },
};

type Theme = 'system' | 'light' | 'dark';

export default function Home() {
  const [theme, setTheme] = useState<Theme>('system');
  const [selected, setSelected] = useState<Project | null>(null);
  const [activePreview, setActivePreview] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
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
    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next === 'system' ? 'light dark' : next;
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
    { name: 'E-mail', href: profile.email ? `mailto:${profile.email}` : undefined, Icon: Mail },
  ];

  return (
    <main className="universe relative isolate min-h-svh" data-panel-open={selected ? 'true' : 'false'}>
      <div className="fluid-scene" aria-hidden="true"><span className="fluid-blob blob-one" /><span className="fluid-blob blob-two" /><span className="fluid-blob blob-three" /></div>
      <div className="home-screen mx-auto flex min-h-svh w-full flex-col">
        <header className="screen-header flex justify-end">
          <div className="site-brand"><h1>fora da tela<span>.</span></h1><p>Projetos que saem do papel.</p></div>
          <button className="theme-switch liquid-glass" onClick={changeTheme}
            aria-label={`Tema: ${theme === 'system' ? 'sistema' : theme === 'light' ? 'claro' : 'escuro'}. Alternar tema`}
            title="Tema: sistema → claro → escuro">
            <span className="theme-sun"><Sun size={18} strokeWidth={1.6} /></span>
            <span className="theme-moon"><Moon size={18} strokeWidth={1.6} /></span>
            {theme === 'system' && <span className="system-indicator" />}
          </button>
        </header>

        <section id="projects" className="project-grid grid grid-cols-3" aria-label="Projetos">
          {projects.map((project) => (
            <button className="project" key={project.id} aria-label={`Conhecer ${project.name}`}
              onClick={(event) => { trigger.current = event.currentTarget; setActivePreview(0); setSelected(project); }}>
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

            <div className="gallery gallery-dual" aria-label={`Duas telas de ${selected.name}`}>
              {[0, 1].map((index) => (
                <div className={`phone-preview dual-phone dual-phone-${index + 1}`} key={index}>
                  <div className="phone-camera" aria-hidden="true" />
                  {selected.screenshots[index] ? (
                    <img src={selected.screenshots[index]} alt={`Captura real ${index + 1} de ${selected.name}`} width={390} height={844} />
                  ) : (
                    <div className="phone-pending"><span>Outra tela</span><small>em breve</small></div>
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
