<template>
  <flowter-edge
    v-if="from && to"
    v-show="showing"
    id="flowter-edge-edit"
    :class="`flowter-edge-edit${editing ? ' editing': ''}`"
    :from="from"
    :to="to"
    :mode="mode"
    :color="`#00ff00`"
    :font-size="fontSize"
    :edge-type="edgeType"
    @mouseleave="$emit('edit', { type: 'hover-end', payload: $event })"
    @click="$emit('edit', { type: 'edit-start', payload: $event })">
    <template v-slot:default="{ start, end }">
      <div
        v-show="editing"
        class="flowter-edge-edit-controls">
        <span @click="$emit('edit', { type: 'edit-end', payload: $event })">
          Exit
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          class="flowter-knob"
          :style="knobStyle(start)"
          :view-box.camel="`0 0 20 20`">
          <circle
            cx="10"
            cy="10"
            r="10"
            fill="#00ff00"
            stroke="none"
            @mousedown="onMouseDown('from')" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          class="flowter-knob"
          :style="knobStyle(end)"
          :view-box.camel="`0 0 20 20`">
          <circle
            cx="10"
            cy="10"
            r="10"
            fill="#00ff00"
            stroke="none"
            @mousedown="onMouseDown('to')" />
        </svg>
      </div>
    </template>
  </flowter-edge>
</template>
<script lang="ts" src="./index.ts"></script>
<style>
.flowter-edge-edit.editing {
  z-index: 3;
}

.flowter-edge-edit-controls span {
  position: absolute;
  font-size: 12px;
  top: 0;
  right: -12px;
  opacity: 1;
  cursor: pointer;
  pointer-events: initial;
}

.flowter-knob {
  position: absolute;
  pointer-events: initial;
  cursor: pointer;
}
</style>
