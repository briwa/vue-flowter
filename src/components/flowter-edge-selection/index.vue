<template>
  <flowter-edge
    v-if="from && to"
    v-show="showing"
    :id="`edge-edit-${from.node.id}-${to.node.id}`"
    :from="from"
    :to="to"
    :mode="mode"
    :color="`#00ff00`"
    :font-size="fontSize"
    :edge-type="edgeType"
    @mouseleave="$emit('edit', { type: 'hover-end', details: $event })"
    @click="$emit('edit', { type: 'edit-start', details: $event })">
    <template v-slot:edit>
      <span
        v-show="editing"
        class="flowter-exit-edit-span"
        @click="$emit('edit', { type: 'edit-end', details: $event })">
        Exit
      </span>
    </template>
  </flowter-edge>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-exit-edit-span {
  position: absolute;
  font-size: 12px;
  right: 0;
  opacity: 1;
  cursor: pointer;
  pointer-events: initial;
}
</style>
