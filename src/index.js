import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener(
  'input',
  debounce(evt => {
    const trimmedValue = inputEl.value.trim();
        if (trimmedValue !== '') {
      fetchCountries(trimmedValue).then(foundData => {
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (foundData.length >= 2 && foundData.length <= 10) {
          renderCountryList(foundData);
        } else if (foundData.length === 1) {
          renderOneCountry(foundData);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

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
  countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country-info">
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50" hight="30">
        <p class="title-country">${country.name.official}</p>
        <p><span class="title"> Capital: </span> ${country.capital}</p>
        <p><span class="title"> Population:</span> ${country.population}</p>
        <p><span class="title"> Languages:</span> ${Object.values(country.languages)}</p>
        </div>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

{/* <li class="list-item">
  <div class="top-info">
    <img class="icon" width="40" src="${flags.svg}" alt="${name.official}"/> */}
    // <p class="capital">${name.official}</p></div>
    // <div class="bottom-info">
    //   <p><span class="title">Capital:</span> ${capital}</p>
    //   <p><span class="title">Population:</span> ${population}</p>
    //   <p><span class="title">Languages:</span> ${languagesValues}</p>
    //   </div></li>