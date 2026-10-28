import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Fora da Tela · Paloma', description: 'Fora da Tela: explore os projetos e aplicações de Paloma em uma experiência espacial.' };
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='system'?'light dark':t}catch(e){}})()`;
export default function Layout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}} /></head><body>{children}</body></html>; }
