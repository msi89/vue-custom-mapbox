<template>
  <div id="app">
    <Map />
  </div>
</template>

<script>
import Map from './components/mapbox/Map'

export default {
  name: 'App',
  components: {
    Map
  }
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.mapboxgl-control-container,
.mapboxgl-ctrl-geolocate {
  visibility: visible;
}
</style>
