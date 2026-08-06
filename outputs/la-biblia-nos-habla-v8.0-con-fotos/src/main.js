import { galleryItems } from './gallery-data.js';

const gallery = document.querySelector('#gallery-grid');
const dialog = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxCategory = document.querySelector('#lightbox-category');
const photoPath = '/images/';

function renderGallery(filter = 'all') {
  const items = filter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === filter);
  gallery.innerHTML = items.map((item) => `<button class="gallery-item photo-slot" data-id="${item.id}" aria-label="Ver ${item.title}">
    <img src="${photoPath + item.file}" alt="${item.alt}" onerror="this.style.display='none'" />
    <span class="photo-placeholder">${item.placeholder}</span><span class="gallery-label"><b>${item.title}</b><small>${item.categoryLabel}</small></span></button>`).join('');
}

renderGallery();
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); renderGallery(button.dataset.filter);
}));
gallery.addEventListener('click', (event) => {
  const card = event.target.closest('[data-id]'); if (!card) return;
  const item = galleryItems.find((entry) => entry.id === card.dataset.id);
  lightboxImage.src = photoPath + item.file; lightboxImage.alt = item.alt; lightboxImage.onerror = () => { lightboxImage.removeAttribute('src'); };
  lightboxTitle.textContent = item.title; lightboxCategory.textContent = item.categoryLabel; dialog.showModal();
});
document.querySelector('.close-lightbox').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.querySelector('.nav-toggle').addEventListener('click', (event) => { const nav = document.querySelector('.nav'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', open); });
document.querySelector('#prayer-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#form-status').textContent = 'Gracias. Recibimos su petición y oraremos por usted.'; event.target.reset(); });
document.querySelector('#year').textContent = new Date().getFullYear();
