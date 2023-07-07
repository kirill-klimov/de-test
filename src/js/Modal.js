export default class Modal {
    constructor(message) {
        this.message = message;
    }

    open() {
        document.getElementById('my-modal-backdrop').classList.add('show');
        document.getElementById('my-modal-text').textContent = this.message;
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.getElementById('my-modal-text').textContent = '';
        document.getElementById('my-modal-backdrop').classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}