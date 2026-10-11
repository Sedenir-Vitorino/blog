"use client";
import { useEffect, type DependencyList, type RefObject } from "react";

/**
 * Animação de entrada dos elementos [data-reveal] dentro de `ref`.
 * - Revela só na primeira vez que o elemento entra na tela (data-revealed fica no DOM,
 *   então rolar para cima não repete nem inverte a animação).
 * - Elementos que entram juntos ganham um atraso sequencial curto (70ms, no máximo 5 passos).
 * - Saltos de rolagem (End, âncoras) não deixam buracos: o que já ficou acima da tela é
 *   revelado na hora, porque o IntersectionObserver não avisa quem passou direto.
 * - O estado escondido só existe no CSS sob .js + prefers-reduced-motion: no-preference.
 */
export function useReveal(ref: RefObject<HTMLElement | null>, deps: DependencyList = []) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const pending = new Set(
      root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );
    const reveal = (el: HTMLElement, delay = 0) => {
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
        el.addEventListener("transitionend", () => (el.style.transitionDelay = ""), {
          once: true,
        });
      }
      el.setAttribute("data-revealed", "");
      pending.delete(el);
    };

    if (!("IntersectionObserver" in window)) {
      pending.forEach((el) => reveal(el));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let step = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement, Math.min(step, 5) * 70);
          step++;
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );

    let frame = 0;
    const revealPassed = () => {
      frame = 0;
      for (const el of pending) {
        const rect = el.getBoundingClientRect();
        // display:none (ex.: lateral de desktop no celular) tem rect zerado: ignora
        if (rect.height > 0 && rect.bottom < 0) {
          reveal(el);
          observer.unobserve(el);
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(revealPassed);
    };

    pending.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
    // Re-observa quando a lista muda (ex.: filtros, "carregar mais"): itens já revelados
    // mantêm data-revealed; os novos animam ao entrar na tela.
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
