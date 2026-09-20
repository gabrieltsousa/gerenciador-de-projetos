import '@testing-library/jest-dom/vitest'

// jsdom não implementa o comportamento modal de <dialog> (showModal/close) —
// é uma lacuna conhecida do jsdom, não do navegador real (verificado
// manualmente: funciona corretamente em Chrome). Sem isso, todo teste que
// passa por BaseModal.vue falha com "showModal is not a function".
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
