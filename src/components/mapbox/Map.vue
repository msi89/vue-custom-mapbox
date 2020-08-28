<template>
  <div class="map-wrapper">
    <div id="map" :style="_styles"></div>

    <!-- map controls -->
    <div class="map-controls">
      <div class="map-zoom-controls" v-if="showLocateControl">
        <button @click="zoomIn()">&#43;</button>
        <div class="divider" />
        <button @click="zoomOut()">&#8722;</button>
      </div>
      <button
        class="btn-control"
        @click="locate()"
        title="Locate me"
        v-if="showLocateControl"
      >
        <svg viewBox="0 0 512 512">
          <path
            d="m8.828125 282.484375h45.902344c12.0625 91.066406 83.71875 162.722656 174.785156 174.785156v45.902344c.015625 4.871094 3.960937 8.8125 8.828125 8.828125h35.3125c4.867188-.015625 8.8125-3.957031 8.828125-8.828125v-45.902344c91.066406-12.0625 162.722656-83.71875 174.785156-174.785156h45.902344c4.871094-.015625 8.8125-3.960937 8.828125-8.828125v-35.3125c-.015625-4.867188-3.957031-8.8125-8.828125-8.828125h-45.902344c-12.0625-91.066406-83.71875-162.722656-174.785156-174.785156v-45.902344c-.015625-4.871094-3.960937-8.8125-8.828125-8.828125h-35.3125c-4.867188.015625-8.8125 3.957031-8.828125 8.828125v45.902344c-91.066406 12.0625-162.722656 83.71875-174.785156 174.785156h-45.902344c-4.871094.015625-8.8125 3.960937-8.828125 8.828125v35.3125c.015625 4.867188 3.957031 8.8125 8.828125 8.828125zm247.171875-176.554687c82.878906 0 150.070312 67.191406 150.070312 150.070312s-67.191406 150.070312-150.070312 150.070312-150.070312-67.191406-150.070312-150.070312c.117187-82.832031 67.238281-149.953125 150.070312-150.070312zm0 0"
          />
          <path
            d="m326.621094 256c0 39.003906-31.617188 70.621094-70.621094 70.621094s-70.621094-31.617188-70.621094-70.621094 31.617188-70.621094 70.621094-70.621094 70.621094 31.617188 70.621094 70.621094zm0 0"
          />
        </svg>
      </button>
      <button
        class="btn-control"
        @click="fullscreen()"
        title="Full screen"
        v-if="showFullscreenControl"
      >
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M19,3H15V5H19V9H21V5C21,3.89 20.1,3 19,3M19,19H15V21H19A2,2 0 0,0 21,19V15H19M5,15H3V19A2,2 0 0,0 5,21H9V19H5M3,5V9H5V5H9V3H5A2,2 0 0,0 3,5Z"
          />
        </svg>
      </button>
    </div>

    <MapMarker :m="map" latitude="55.751244" longitude="37.618423" />
  </div>
</template>

<script>
import { isNumeric, Location, Map } from './helper'
import MapMarker from './Marker'

export default {
  components: { MapMarker },
  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    showLocateControl: { type: Boolean, default: false },
    showZoomControls: { type: Boolean, default: false },
    showFullscreenControl: { type: Boolean, default: false },
    center: {
      type: Array,
      default: () => [37.618423, 55.751244] /* [longitude, latitude] */
    },
    zoom: { type: [Number, String], default: 12 },
    accessToken: {
      type: String,
      default:
        'pk.eyJ1IjoibXNpODkiLCJhIjoiY2pxZ3pkZzdoNTQ1NjQzcHB1cnozY3ZuYiJ9.r8-AsWcESYVuNUe-josDZw'
    },
    mapStyle: { type: String, default: 'mapbox://styles/mapbox/streets-v11' }
  },
  data() {
    return {
      map: null,
      markers: []
    }
  },
  beforeCreate() {
    Location.watch()
  },
  mounted() {
    this.map = new Map(this.accessToken, {
      container: 'map',
      style: this.mapStyle,
      center: this.center, // starting position
      zoom: this.zoom,
      interactive: true
    })

    this.map.on('load', this.onLoad)
    this.map.on('click', this.onMapClick)

    this.map.setNavigationControl({
      position: 'bottom-right'
    })
    this.map.setGeolocateControl()
    this.map.setFullscreenControl()
  },
  computed: {
    currentLocation() {
      return Location.current
    },
    _styles() {
      return {
        width: this._width,
        height: this._height
      }
    },
    _width() {
      return isNumeric(this.width) ? this.width + 'px' : this.width
    },
    _height() {
      return isNumeric(this.height) ? this.height + 'px' : this.height
    }
  },
  methods: {
    onLoad() {
      console.log('load map...')
    },
    onMapClick(e) {
      if (
        this.markers.findIndex(
          m => m.lng === e.lngLat.lng && m.lat === e.lngLat.lat
        ) > -1
      ) {
        console.log('exist deja')
      } else {
        this.markers.push(e.lngLat)
        this.map.addMarker(e.lngLat.lat, e.lngLat.lng, 'Marker 1')
      }
      console.log(e.lngLat)
    },
    zoomIn() {
      this.map.zoomIn()
    },
    zoomOut() {
      this.map.zoomOut()
    },
    locate() {
      this.map.locateMe()
    },
    fullscreen() {
      this.map.fullscreen()
    },
    addMarker(lat, lng) {
      this.map.addMarker(lat, lng)
    },
    flyTo(lat, lng) {
      this.map.flyTo(lat, lng)
    }
  },
  beforeDestroy() {
    Location.destroy()
  }
}
</script>

<style lang="scss" scoped>
$control-width: 30px;
$control-box-shadow: 0 0 2px #999;
$control-border: 1px solid #eee;
$control-color: rgba(0, 0, 0, 0.5);
$control-color-hover: rgba(0, 0, 0, 0.6);

.map-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;

  .map-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: block;
    button {
      outline: none;
      border: none;
      background: transparent;
      width: $control-width;
      height: $control-width;
      cursor: pointer;
      font-weight: 700;
      font-size: 1.1rem;
      color: $control-color;
      transition: all 0.2s;

      svg {
        fill: $control-color;
        width: 16px;
        height: 16px;
        transition: all 0.2s;
      }

      &:hover {
        color: $control-color-hover;
        svg: {
          fill: $control-color-hover;
        }
      }
    }
    .btn-control {
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      border: $control-border;
      margin: 10px 0;
      box-shadow: $control-box-shadow;
    }
    .map-zoom-controls {
      width: 30px;
      background: #fff;
      border: $control-border;
      border-radius: 20px;
      box-shadow: $control-box-shadow;

      .divider {
        width: 25px;
        height: 0.025rem;
        background: #eee;
        margin: 0px auto;
      }
    }
  }
}
</style>
