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
    <template #default="{ start, end }">
      <flowter-knob
        :x="start.x"
        :y="start.y" />
      <flowter-knob
        :x="end.x"
        :y="end.y" />
    </template>
  </flowter-edge>
</template>
<script lang="ts" src="./index.ts"></script>
