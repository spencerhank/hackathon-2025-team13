<template>
  <div class="hero-banner-wrapper">
    <video muted autoplay ref="videoPlayer">
      <source
        data-src="https://www.aholddelhaize.com/media/ynyn1t4t/2018_tempo_store_3_1.mp4"
        type="video/mp4"
        src="https://www.aholddelhaize.com/media/ynyn1t4t/2018_tempo_store_3_1.mp4"
      />
    </video>
    <div class="hero-banner-content">
      <div class="text-h4 font-weight-light mb-n1">Welcome to the</div>

      <h1 class="text-h2 font-weight-bold">Retail 360 Dashboard</h1>
    </div>
  </div>
  <div class="bg-surface-0 dark:bg-surface-900">
    <HelloWorld />
  </div>
</template>

<script setup></script>

<style scoped>
video {
  display: block;
  object-fit: cover;
  width: 100%;
  height: 200px;
  top: 0;
  right: 0;
  overflow-y: clip;
  overflow-x: clip;
}

.hero-banner-wrapper {
  position: relative;
}

.hero-banner-content {
  color: white;
  position: absolute;
  max-width: 105rem;
  padding-left: 20rem;
  padding-right: 20rem;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  /* top: 50%; */
}
</style>
