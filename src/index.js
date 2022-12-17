import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(countryInput, DEBOUNCE_DELAY));

function countryInput() {
  const trimmedValue = inputEl.value.trim();
  if (trimmedValue === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }
  fetchCountries(trimmedValue).then(countries => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if (countries.length === 1) {
      countryInfo.insertAdjacentHTML('beforeend', renderOneCountry(countries));
    } else if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countries.length === 0) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return;
    } else {
      countryList.insertAdjacentHTML('beforeend', renderCountryList(countries));
    }
  });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<ul class="country-list">
      <li><img src="${country.flags.svg}" 
      alt="Flag of ${country.name.official}" 
      width="50" hight="30"> ${country.name.official}</p>
      </li></ul>`;
    })
    .join('');
  return markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<div class="title-country"><img src="${
        country.flags.svg
      }" alt="Flag of ${country.name.official}" width="50" hight="30">
        ${country.name.official}</div>
        <p><span class="title"> Capital: </span> ${country.capital}</p>
        <p><span class="title"> Population:</span> ${country.population}</p>
        <p><span class="title"> Languages:</span> ${Object.values(
          country.languages
        )}</p>`;
    })
    .join('');
  return markup;
}
