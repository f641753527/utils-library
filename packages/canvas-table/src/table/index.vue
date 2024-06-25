<template>
    <div class="phoenix_canvas-table--container">
        <canvas class="phoenix_canvas-table--content" :height="props.height"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { ITableCompProps } from './types'
import CanvasTable from './CanvasTable'

const props = withDefaults(defineProps<ITableCompProps>(), {
    height: 300,
    rowHeight: 30,
    headerHight: 30,
})

onMounted(() => {
    const selector = document.querySelector('.phoenix_canvas-table--container')
    if (!selector) {
        throw new Error('组件加载失败...')
    }
    const canvas = document.querySelector('.phoenix_canvas-table--content') as HTMLCanvasElement
    if (!canvas) {
        throw new Error('组件加载失败...')
    }
    const clientWidth = selector.clientWidth
    new CanvasTable({
        canvas: canvas,
        table: props,
        clientWidth,
    })
})

</script>

<style lang="less" scoped>
.phoenix_canvas-table--container{
    font-size: 0;
}
</style>
