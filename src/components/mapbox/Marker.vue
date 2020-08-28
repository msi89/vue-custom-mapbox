<template>
  <div class="marker">
    <slot />
  </div>
</template>

<script>
//const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

export default {
  props: {
    latitude: { type: [String, Number], required: true },
    longitude: { type: [String, Number], required: true },
    m: Object
  },
  data() {
    return {
      map: this.$parent.map
    }
  },
  mounted() {
    this.map = this.$parent.$data.map
    console.log(this.m)
    // const rootElem = document.querySelector('.marker').innerHTML
    // const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(rootElem)

    // new mapboxgl.Marker()
    //   .setLngLat([this.longitude, this.latitude])
    //   .setPopup(popup)
    //   .addTo(this.map)
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
