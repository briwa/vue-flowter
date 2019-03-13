<template>
  <div id="app">
    <img class="bg" src="./assets/grid.png"/>
    <div class="cont">
      <flowter-node :id="1" text="lol">
        <template v-slot:default="{ orientPoint }">
          <flowter-edge :from="3" :to="3" :start-point="orientPoint" :end-point="[50,150]" />
          <flowter-edge :from="3" :to="3" :start-point="orientPoint" :end-point="[0,150]" />
          <flowter-edge :from="3" :to="3" :start-point="orientPoint" :end-point="[100,200]" />
        </template>
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.1;
}

.cont {
  zoom: 2;
}
</style>
