import './css/styles.less';
import Handlebars from 'handlebars';
import { hasErrors, validateEmail } from './js/utils';
import { featuresData } from './js/data';
import Modal from './js/Modal';

const featuresContainer = document.getElementById('features');
const featureSource = document.getElementById('feature-card-template').innerHTML;
const featureTemplate = Handlebars.compile(featureSource);
const featureHtml = featureTemplate({ cards: featuresData });
featuresContainer.innerHTML += featureHtml;

const partnersContainer = document.getElementById('partners');
const partnerSource = document.getElementById('partner-card-template').innerHTML;
const partnerTemplate = Handlebars.compile(partnerSource);
const partnerHtml = partnerTemplate({
    cards: Array.from(Array(8)).map((item, index) => {
        if (index === 7) {
            return ({
                title: 'More Client',
                url: '#',
                isMoreBtn: true,
            })
        } else {
            return ({
                title: `LOGO CLIENT ${index + 1}`,
                url: '#',
            })
        }
    })
});
partnersContainer.innerHTML += partnerHtml;

const modal = document.getElementById('modal-backdrop');

document.getElementById('modal-open')?.addEventListener('click', () => {
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
})

function closeModal() {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

document.getElementById('modal')?.addEventListener('click', e => e.stopPropagation());
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-backdrop')?.addEventListener('click', closeModal);

const errors = {
    name: true,
    email: true,
    message: true,
}

document.querySelectorAll('.modal-input').forEach(input => {
    input.addEventListener('input', (e) => {
        const errorSpan = document.querySelector(`.modal-input[name="${e.target.name}"] + span`);
        switch(e.target.name) {
            case 'name':
                if (e.target.value.length < 3) {
                    errorSpan.textContent = 'Name must contain at least 3 characters';
                    errors[e.target.name] = true;
                } else {
                    errorSpan.textContent = '';
                    errors[e.target.name] = false;
                }
                break;
            case 'email':
                if (!validateEmail(e.target.value)) {
                    errorSpan.textContent = 'Provide a valid email';
                    errors[e.target.name] = true;
                } else {
                    errorSpan.textContent = '';
                    errors[e.target.name] = false;
                }
                break;
            case 'message':
                if (e.target.value.length < 1) {
                    errorSpan.textContent = 'Message cannot be empty';
                    errors[e.target.name] = true;
                } else {
                    errorSpan.textContent = '';
                    errors[e.target.name] = false;
                }
                break;
            default: break;
        }
    });
});

const loading = document.getElementById('modal-loading');
document.getElementById('modal-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (hasErrors(errors)) return;

    const formData = new FormData(e.target);
    const body = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    };

    loading.classList.add('show');
    const xhr = new XMLHttpRequest();
    const api = "https://example.com/api";
    xhr.open("POST", api);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function () {
        if (xhr.DONE == 4) {
            loading.classList.remove('show');

            const myModal = new Modal('Your message successfully sent');
            myModal.open();
            document.getElementById('my-modal-backdrop')?.addEventListener('click', () => {
                Array.from(Object.keys(errors)).forEach(key => errors[key] = true);
                Array.from(Object.keys(body)).forEach(key => {
                    document.querySelector(`.modal-input[name="${key}"]`).value = '';
                });
                closeModal();
                myModal.close();
            });
        }
    };
})




