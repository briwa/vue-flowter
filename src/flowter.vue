<template>
  <div id="app">
    <img class="bg" src="./assets/grid.png"/>
    <div
      :style="containerStyle"
      class="flowter-container">
      <flowter-node
        :left="200"
        :top="50"
        :id="1"
        text="First">
        <template v-slot:default="{ orientPoint }">
          <flowter-edge
            :from="3"
            :to="3"
            :start-point="orientPoint"
            :end-point="[50,150]" />
          <flowter-edge
            :from="3"
            :to="3"
            :start-point="orientPoint"
            :end-point="[-50,100]" />
          <flowter-edge
            :from="3"
            :to="3"
            :start-point="orientPoint"
            :end-point="[150,200]" />
        </template>
      </flowter-node>
      <flowter-node
        :left="100"
        :top="200"
        :id="2"
        text="Second">
      </flowter-node>
      <flowter-node
        :left="200"
        :top="300"
        :id="3"
        text="Third">
      </flowter-node>
      <flowter-node
        :left="300"
        :top="400"
        :id="4"
        text="Fourth">
      </flowter-node>
    </div>
  </div>
</template>
<script lang="ts" src="./flowter.ts"></script>
<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.1;
}

.flowter-container {
  zoom: 2;
}
</style>
