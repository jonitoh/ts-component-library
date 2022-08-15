export function toggleScrollLock() {
  const node = document.querySelector("html");
  if (node) node.classList.toggle("scroll-lock");
}
