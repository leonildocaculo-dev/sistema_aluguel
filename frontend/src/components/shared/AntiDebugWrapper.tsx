"use client";

import { useEffect } from 'react';

export function AntiDebugWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apenas ativa se a variável de ambiente de Hardening estiver a true
    if (process.env.NEXT_PUBLIC_SECURITY_HARDENING !== 'true') return;

    // Bloquear clique direito (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Bloquear atalhos de teclado (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      
      // Ctrl+Shift+I / Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }

      // Ctrl+Shift+J / Cmd+Option+J (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }

      // Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
      
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Bónus: Detetar a abertura do console se ancorado, travando a renderização.
    // Usamos um debugger loop sutil que irrita as ferramentas de devtools (Opcional, mas comum em Anti-DevTools)
    const antiDebugLoop = setInterval(() => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = new Date().getTime();
      if (end - start > 100) {
        // Devtools provavelmente abertas
        document.body.innerHTML = "<h1>Tentativa de Depuração Bloqueada por Motivos de Segurança.</h1>";
      }
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(antiDebugLoop);
    };
  }, []);

  return <>{children}</>;
}
