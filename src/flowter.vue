<template>
  <div id="app">
    <img class="bg" src="./assets/grid.png"/>
    <div
      :style="containerStyle"
      class="flowter-container">
      <div
        v-for="(row, rowIdx) in shapedNodes"
        :key="rowIdx">
        <flowter-node
          v-for="(node, colIdx) in row"
          :key="node.id"
          :id="node.id"
          :text="node.text"
          :top="rowIdx * 100"
          :left="colIdx * 150">
        </flowter-node>
      </div>
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
