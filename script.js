'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map;
let startCoords;
let endCoords;
let markerEnd;
let markerStart;
let a = 0;
let endMarker;
let startMarker;
let umumiyMasofa;

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-8);
  constructor(speed) {
    this.speed = speed;
    // this.startCoords = startCoords;
    // this.endCoords = endCoords;
  }
  setTavsif() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.malumot = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(speed) {
    // super(startCoords, endCoords);
    super(speed);
    // this.speed = speed;
    this.setTavsif();
  }
  // this.setTavsif()
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(speed) {
    // super(startCoords, endCoords);
    super(speed);
    // this.speed = speed;
    this.setTavsif();
  }
}

class Driving extends Workout {
  type = 'driving';
  constructor(speed) {
    // super(startCoords, endCoords);
    super(speed);
    // this.speed = speed;
    this.setTavsif();
  }
}

class App {
  #mashqlar = [];
  constructor() {
    this.openMap();
    window.addEventListener('keydown', this.showForm.bind(this));
  }
  openMap() {
    navigator.geolocation.getCurrentPosition(
      this.showMap.bind(this),
      function () {
        alert('geolokatsiya ola olmadik. Qayta urinib kurin');
      }
    );
  }
  showMap(e) {
    map = L.map('map').setView([e.coords.latitude, e.coords.longitude], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      map
    );
    markerStart = L.marker([e.coords.latitude, e.coords.longitude], {
      draggable: true,
    })
      .addTo(map)
      .bindPopup('Siz turgan joy!')
      .openPopup();
    // console.log(markerStart);
  }

  showForm() {
    a++;
    if (!(a == 1 || a == 2)) return;
    if (a == 1) {
      startCoords = markerStart.getLatLng();
      map.removeLayer(markerStart);
      startMarker = L.marker([startCoords.lat, startCoords.lng], {
        draggable: false,
      })
        .addTo(map)
        .bindPopup('Siz turgan joy!')
        .openPopup();

      markerEnd = L.marker([startCoords.lat + 0.005, startCoords.lng + 0.005], {
        draggable: true,
      })
        .addTo(map)
        .bindPopup('Siz bormoqchi bo`lgan joy')
        .openPopup();
    }
    // console.log(startCoords);
    if (a == 2) {
      endCoords = markerEnd.getLatLng();
      map.removeLayer(markerEnd);
      endMarker = L.marker([endCoords.lat, endCoords.lng], {
        draggable: false,
      })
        .addTo(map)
        .bindPopup('Siz bormoqchi bo`lgan joy')
        .openPopup();
      form.classList.remove('hidden');
      // inputDistance.focus();
      this.hiddenForm();
    }
  }
  hiddenForm() {
    form.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        // create object========================
        let numbermi = function (speed) {
          return isFinite(speed);
        };
        // let musbatmi = function (speed) {
        //   return speed > 0 ? true : false;
        // };
        let mashq = '';
        let speed = inputDistance.value;
        inputDistance.value = ' ';
        let type = inputType.value;
        if (type == 'running') {
          if (!numbermi(speed) || !(speed > 0)) {
            return alert('Xato amulomotlar kiritildi');
          }
          mashq = new Running(speed);
        }
        if (type == 'cycling') {
          if (!numbermi(speed) || !(speed > 0)) {
            return alert('Xato amulomotlar kiritildi');
          }
          mashq = new Cycling(speed);
        }
        if (type == 'driving') {
          if (!numbermi(speed) || !(speed > 0)) {
            return alert('Xato amulomotlar kiritildi');
          }
          mashq = new Driving(speed);
        }
        console.log(mashq);
        this.#mashqlar.push(mashq);
        console.log(this.#mashqlar);
        //=========
        form.classList.add('hidden');
        // localStoregdan malumotlarni olish
        this.getLocalStorage();
        // html fayllarini render qilish
        this.renderList(mashq);
        // setlocationdan foydalanish
        this.setLocalStorage(mashq);
      }.bind(this)
    );
    this.drawMap();
  }
  drawMap() {
    L.Routing.control({
      createMarker() {
        return null;
      },
      waypoints: [
        L.latLng(startCoords.lat, startCoords.lng),
        L.latLng(endCoords.lat, endCoords.lng),
      ],
      lineOptions: {
        styles: [{ color: 'blue', opacity: 1, weight: 5 }],
      },
    })
      .on('routesfound', function (e) {
        umumiyMasofa = e.routes[0].summary.totalDistance;
        // console.log(umumiyMasofa);
        // console.log(e);
        // console.log(e.routes[0].summary.totalDistance);
        // console.log(route.summary.totalDistance);
      })
      .addTo(map);
    let btn = document.querySelector('.leaflet-routing-container');
    btn.addEventListener('click', function () {
      btn.classList.toggle('leaflet-routing-container-hide');
    });

    // mashqlarni ekrang chiqarish
  }

  renderList(obj) {
    let html = `
    <li class="workout workout--${obj.type}" data-id="${obj.id}">
          <h2 class="workout__title">
          ${obj.malumot}</h2>
          <div class="workout__details">
            <span class="workout__icon">${obj.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}
            </span>
            <span class="workout__value">${umumiyMasofa}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${umumiyMasofa / obj.speed}</span>
            <span class="workout__unit">min</span>
          </div>
    `;
    if (obj.type === 'running') {
      html += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${(obj.speed / 60).toFixed(3)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${obj.cadense}</span>
            <span class="workout__unit">spm</span>
          </div>
        
      `;
    }
    if (obj.type === 'cycling') {
      html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${obj.speed}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${obj.elevation}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>
      `;
    }
    if (obj.type === 'driving') {
      html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${obj.speed}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🌏</span>
      <span class="workout__value">${obj.elevation}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>
      `;
    }
    form.insertAdjacentHTML('afterend', html);
  }

  // createObject(e) {
  //   e.preventDefault();
  // }

  setLocalStorage() {
    localStorage.setItem('mashqlar', JSON.stringify(this.#mashqlar));
  }

  getLocalStorage() {
    let data = JSON.parse(localStorage.getItem('mashqlar'));
    if (!data) return;
    console.log(data);

    this.#mashqlar = data;
    this.#mashqlar.forEach(val => {
      this.renderList(val);
      // this.setMarker(val);
    });
  }
}

const magicMap = new App();
