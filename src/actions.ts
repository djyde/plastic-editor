export function clickOutside(el, cb) {
  function handler(e) {
    if (e.target !== el) {
      cb();
    }
  }

  document.addEventListener("click", handler);

  return {
    destroy() {
      document.removeEventListener("click", handler);
    },
  };
}

function resize({ target }) {
  target.style.height = "1px";
  target.style.height = +target.scrollHeight + "px";
}

export function autoResize(el) {
  resize({ target: el });
  el.style.overflow = "hidden";
  el.addEventListener("input", resize);

  return {
    destroy: () => el.removeEventListener("input", resize),
  };
}
