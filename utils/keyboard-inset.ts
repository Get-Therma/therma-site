// utils/keyboard-inset.ts
export function initKeyboardInset() {
  // Prefer VirtualKeyboard API when present
  const vk = (navigator as any).virtualKeyboard;
  if (vk && typeof vk.addEventListener === 'function') {
    // @ts-ignore
    vk.overlaysContent = true;
    const set = () => {
      // @ts-ignore
      const h = (vk.boundingRect?.height ?? 0);
      document.documentElement.style.setProperty('--vk-height', h + 'px');
    };
    vk.addEventListener('geometrychange', set);
    set();
    return;
  }

  // Fallback: VisualViewport (widely supported)
  if (window.visualViewport) {
    const set = () => {
      const vh = window.visualViewport!.height;
      const dh = window.innerHeight;
      const keyboard = Math.max(0, dh - vh);
      document.documentElement.style.setProperty('--vk-height', keyboard + 'px');
    };
    window.visualViewport.addEventListener('resize', set);
    window.visualViewport.addEventListener('scroll', set);
    set();
  }
}
