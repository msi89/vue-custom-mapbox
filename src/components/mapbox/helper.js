const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

function isNumeric(value) {
  return /^\d+$/.test(value)
}

class Location {
  static get options() {
    return {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  }

  static set options(options) {
    this.options = { ...this.options, ...options }
  }

  static watch() {
    this.watchId = navigator.geolocation.watchPosition(
      this.onLocationSuccess,
      this.onLocationSuccess,
      this.options
    )
  }
  static onLocationSuccess = position => {
    this.current = position.coords
  }
  static onLocationError(error) {
    console.warn(`CURRENT POSITION ERROR:(${error.code}): ${error.message}`)
  }
  static getPosition() {
    navigator.geolocation.getCurrentPosition(
      this.onLocationSuccess,
      this.onLocationSuccess,
      this.options
    )
  }

  static destroy() {
    navigator.geolocation.clearWatch(this.watchId)
  }
}

class Map {
  constructor(
    accessToken,
    options = {
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [37.618423, 55.751244],
      zoom: 12
    }
  ) {
    mapboxgl.accessToken =
      accessToken ||
      'pk.eyJ1IjoibXNpODkiLCJhIjoiY2pxZ3pkZzdoNTQ1NjQzcHB1cnozY3ZuYiJ9.r8-AsWcESYVuNUe-josDZw'

    this.options = { ...this.options, ...options }
    this.map = new mapboxgl.Map(this.options)
  }

  on(eventName, eventListener) {
    this.map.on(eventName, eventListener)
  }

  setNavigationControl(options) {
    const _options = {
      showCompass: true,
      showZoom: true,
      position: 'top-right',
      ...options
    }
    this.map.addControl(
      new mapboxgl.NavigationControl(_options),
      _options.position
    )
  }

  setGeolocateControl(options) {
    const _options = {
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: false,
      showUserLocation: true,
      position: 'top-right',
      ...options
    }
    this.map.addControl(
      new mapboxgl.GeolocateControl(_options),
      _options.position
    )
  }
  setFullscreenControl(postion = 'top-right') {
    this.map.addControl(
      new mapboxgl.FullscreenControl({
        container: document.querySelector('body')
      }),
      postion
    )
  }

  addPopup(coordinates, description) {
    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(this.map)
  }
  addMarker(lat, lng, title = '') {
    // create the popup
    var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(title)

    // create the marker
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(this.map)
    // if (this.map.getBounds().contains(marker._lngLat)) {
    //   console.error('marker: ', marker._lngLat, 'exists')
    // } else {
    //   //marker.addTo(this.map)
    //   console.log('marker: ', marker._lngLat)
    // }
    return marker
  }
  async flyTo(lat, lng, zoom = 8) {
    await this.map.flyTo({
      center: [lng, lat],
      zoom: zoom,
      speed: 2,
      easing: function(t) {
        return t
      },
      essential: true
    })
  }
  zoomIn(options = {}) {
    const _options = {
      duration: 1000,
      ...options
    }
    this.map.zoomIn(_options)
  }
  zoomOut(options = {}) {
    const _options = {
      duration: 1000,
      offset: [80, 60],
      ...options
    }
    this.map.zoomOut(_options)
  }
  zoomTo(zoom, options = {}) {
    const _options = {
      duration: 2000,
      offset: [100, 50],
      ...options
    }
    this.map.zoomTo(_options)
  }
  remove() {
    this.map.remove()
  }
  fullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }
  locateMe() {
    const gps = document.querySelector('.mapboxgl-ctrl-geolocate')
    gps.click()
  }
}

export { Location, isNumeric, Map }
