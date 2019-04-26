<template>
  <flowter-edge
    v-show="editing"
    id="flowter-edge-edit"
    color="#00ff00"
    :from="from"
    :to="to"
    :mode="mode"
    :font-size="fontSize"
    :edge-type="edgeType">
  </flowter-edge>
</template>
<script lang="ts" src="./index.ts"></script>
