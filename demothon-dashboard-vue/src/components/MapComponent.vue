<template>
  <ol-map
    style="width: 100%; height: 500px"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
  >
    <ol-view ref="mapView" :center="center" :rotation="0" :zoom="zoom" />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-source-vector :projection="mapView" ref="drawingVectorSource">
        <ol-interaction-draw
          v-if="drawEnabled"
          type="Polygon"
          maxPoints="4"
          @drawend="handleDrawEnd"
        >
          <ol-style>
            <ol-style-stroke color="blue" :width="2"></ol-style-stroke>
            <ol-style-fill color="rgba(255, 255, 0, 0.4)"></ol-style-fill>
            <ol-style-circle :radius="5">
              <ol-style-fill color="#00dd11" />
              <ol-style-stroke color="blue" :width="2" />
            </ol-style-circle>
          </ol-style>
        </ol-interaction-draw>
      </ol-source-vector>

      <ol-style>
        <ol-style-stroke color="red" :width="2"></ol-style-stroke>
        <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
        <ol-style-circle :radius="7">
          <ol-style-fill color="red"></ol-style-fill>
        </ol-style-circle>
      </ol-style>
    </ol-vector-layer>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature v-for="(coordinate, index) in coordinates" :key="index">
          <ol-geom-point :coordinates="coordinate.latLong"></ol-geom-point>

          <ol-style>
            <ol-style-circle :radius="radius">
              <ol-style-fill :color="fill"></ol-style-fill>
              <ol-style-stroke
                color="green"
                :width="strokeWidth"
              ></ol-style-stroke>
            </ol-style-circle>
            <!-- <ol-style-icon :scale="1">
              <span><v-icon icon="mdi-tag" color="blue"></v-icon></span>

              
             </ol-style-icon> -->
          </ol-style>
          <ol-interaction-select
            :condition="selectCondition"
            @select="handleSelect"
          >
            <!-- Style for selected features -->
            <ol-style>
              <ol-style-circle :radius="6">
                <ol-style-fill :color="'#0088ff'"></ol-style-fill>
                <ol-style-stroke :color="'#fff'" :width="2"></ol-style-stroke>
              </ol-style-circle>

              <!-- This label only appears on selected features -->
              <ol-style-text
                :text="getSelectedLabel"
                :offset-y="20"
                :offset-x="30"
                :padding="[5, 8, 5, 8]"
                :background-fill="true"
                background-color="#ffffff"
                :border-radius="10"
              >
                <ol-style-fill :color="'white'"></ol-style-fill>
              </ol-style-text>
            </ol-style>
          </ol-interaction-select>
        </ol-feature>
        <!-- Selection interaction -->
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
  <!-- <v-btn
    variant="tonal"
    class="mt-3"
    @click="toggleDraw"
    :color="drawEnabled ? 'error' : 'success'"
  >
    {{ drawEnabled ? "Disable Draw" : "Enable Draw" }}
  </v-btn>

  <v-btn variant="tonal" class="mt-3 ml-5" @click="resetDraw" color="error">
    Reset Drawings
  </v-btn> -->
</template>

<script setup>
import { useGeographic } from "ol/proj";
import { ref, computed } from "vue";

const drawEnabled = ref(false);
const drawingVectorSource = ref(null);
const mapView = ref(null);
const solaceSubscriptionCoordinates = ref(null);

const center = ref([-75.6972, 45.4215]);
const zoom = ref(10);
const radius = ref(10);
const strokeWidth = ref(3);
const fill = ref("#ffffff");
const coordinate1 = {
  latLong: [-75.6972, 45.4215],
  label: "Store 1",
};
const coordinate2 = {
  latLong: [-75.91909, 45.34808],
  label: "Store 2",
};

function toggleDraw() {
  drawEnabled.value = !drawEnabled.value;
}

function resetDraw() {
  drawingVectorSource.value.source.clear();
}

function handleDrawEnd(event) {
  solaceSubscriptionCoordinates.value =
    event.feature.getGeometry().flatCoordinates;
  toggleDraw();
}

useGeographic();

const coordinates = ref([coordinate1, coordinate2]);
const selectedFeatureCoordinates = ref(null);

const selectConditions = inject("ol-selectconditions");

const selectCondition = selectConditions.singleClick;

function handleSelect(event) {
  const selected = event.selected;

  if (selected.length > 0) {
    // Get the ID of the selected feature (which we set to the point index)
    selectedFeatureCoordinates.value =
      selected[0].getGeometry().flatCoordinates;
  } else {
    // Clear selection if nothing is selected
    selectedFeatureCoordinates.value = null;
  }
}

// Computed property to get the label of the selected feature
const getSelectedLabel = computed(() => {
  let found = null;
  if (selectedFeatureCoordinates.value !== null) {
    found = coordinates.value.find((coordinate) => {
      return (
        coordinate.latLong[0] == selectedFeatureCoordinates.value[0] &&
        coordinate.latLong[1] == selectedFeatureCoordinates.value[1]
      );
    });
  }
  return found ? found.label : "";
});
</script>
