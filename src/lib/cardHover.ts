import { GLOBAL_CONFIG } from "~/config.mjs";

const THROTTLE_MS = 33;

function attachHandlers(el: HTMLElement) {
  const cfg = GLOBAL_CONFIG.styles.visual.cardHover;
  if (!cfg.enabled) return;

  el.style.transition = `transform ${cfg.duration}s ease-out`;
  el.style.backfaceVisibility = "hidden";

  let lastMove = 0;

  const onMove = (e: MouseEvent) => {
    const now = performance.now();
    if (now - lastMove < THROTTLE_MS) return;
    lastMove = now;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const tx = ((x - cx) / cx) * cfg.maxMove;
    const ty = ((y - cy) / cy) * cfg.maxMove;
    const ry = ((x - cx) / cx) * cfg.maxRotate;
    const rx = -((y - cy) / cy) * cfg.maxRotate;

    el.style.transform = `perspective(1000px) translate(${tx}px,${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${cfg.scale})`;
  };

  const onEnter = (e: MouseEvent) => {
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    el.style.zIndex = "9";
    // Immediately set initial transform
    onMove(e);
  };

  const onLeave = () => {
    el.style.zIndex = "";
    el.style.transform = "perspective(1000px) translate(0,0) rotateX(0) rotateY(0) scale(1)";
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  el.dataset.hoverAttached = "true";
}

export function initCardHover() {
  if (!GLOBAL_CONFIG.styles.visual.cardHover.enabled) return;

  document.querySelectorAll<HTMLElement>(".hoverStyle").forEach(attachHandlers);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node instanceof HTMLElement) {
          if (node.classList?.contains("hoverStyle") && !node.dataset.hoverAttached) attachHandlers(node);
          node.querySelectorAll?.<HTMLElement>(".hoverStyle").forEach((el) => {
            if (!el.dataset.hoverAttached) attachHandlers(el);
          });
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
