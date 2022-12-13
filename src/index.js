import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;


let name = '';

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');

inputEl.addEventListener('input', debounce(onInputHandler, 500));

function onInputHandler(event) {
  listEl.innerHTML = '';
  name = event.target.value.trim();
  if (name.length < 1) return;

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if ((countries.length < 10) & (countries.length > 2)) {
        renderMarkupList(countries);
        return;
      } else if (countries.length === 1) {
        renderMarkupUnique(countries);
        return;
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with  that name')
    );
}

function renderMarkupList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="list-item"><div><img class="icon" width="60" src="${flags.svg}" alt="${name.official}"/><p>${name.official}</p></div></li>`;
    })
    .join('');
  listEl.innerHTML = markup;;
}

function renderMarkupUnique(countries) {
  const markup = countries
    .map(({ languages, name, capital, population, flags }) => {
      const languagesValues = Object.values(languages).join(', ');
      return `<li class="list-item"><div><img class="icon" width="40" src="${flags.svg}" alt="${name.official}"/><p class="capital">${name.official}</p></div><div class="bottom-info"><p><span class="title">Capital:</span> ${capital}</p><p><span class="title">Population:</span> ${population}</p><p><span class="title">Languages:</span> ${languagesValues}</p></div></li>`;
    })
    .join('');
  listEl.innerHTML = markup;;
}