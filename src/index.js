// Imports: SimpleLightbox, Notiflix & Axios

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fadeEffect } from './js/preloader';
import { fetchImages } from './js/fetchImages';

// HTML elements

const searchQuery = document.querySelector('input[name="searchQuery"]');
const closeBtn = document.querySelector('.close-btn');
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

// Needed to query the Pixabay API
let perPage = 40;
let page = 0;
let name = searchQuery.value;

// Needed to hide "load more" and "close" buttons

loadBtn.style.display = 'none';
closeBtn.style.display = 'none';

// Handling the "submit" button event

async function eventHandler(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  loadBtn.style.display = 'none';

  page = 1;
  name = searchQuery.value;

  fetchImages(name, page, perPage)
    .then(name => {
      let totalPages = name.totalHits / perPage;

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        renderGallery(name);
        new SimpleLightbox('.gallery a');
        closeBtn.style.display = 'block';
        closeBtn.addEventListener('click', () => {
          gallery.innerHTML = '';
          closeBtn.style.display = 'none';
        });

        if (page < totalPages) {
          loadBtn.style.display = 'block';
        } else {
          loadBtn.style.display = 'none';
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        gallery.innerHTML = '';
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}

searchForm.addEventListener('submit', eventHandler);

// Function for markup for HTML gallery element

function renderGallery(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">

        <a class="gallery-item" href="${hit.largeImageURL}">
          <img
            class="gallery__image"
            src="${hit.webformatURL}"
            alt="${hit.tags}"
            loading="lazy"
        /></a>

        <div class="info">
          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">likes</b>
            </p>
            <p class="info-counter">${hit.likes.toLocaleString()}</p>
          </div>

          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">views</b>
            </p>
            <p class="info-counter">${hit.views.toLocaleString()}</p>
          </div>

          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">comments</b>
            </p>
            <p class="info-counter">${hit.comments.toLocaleString()}</p>
          </div>

          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">downloads</b>
            </p>
            <p class="info-counter">${hit.downloads.toLocaleString()}</p>
          </div>

        </div>
      </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

// Load more button - function

loadBtn.addEventListener(
  'click',
  () => {
    name = searchQuery.value;
    page += 1;
    fetchImages(name, page, perPage).then(name => {
      let totalPages = name.totalHits / perPage;
      renderGallery(name);
      new SimpleLightbox('.gallery a');
      if (page >= totalPages) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  },
  true
);

// Preloader

window.addEventListener('load', fadeEffect);
