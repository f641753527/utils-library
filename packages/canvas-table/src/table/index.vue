<template>
    <div class="phoenix_canvas-table--container">
        <canvas class="phoenix_canvas-table--content"></canvas>
        <div class="canvas-table-scrolly-box" :style="{ top: props.headerHight + 'px' }">
            <div class="canvas-table-scrolly-bar"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { ITableCompProps } from './types'
import CanvasTable from './CanvasTable'

const props = withDefaults(defineProps<ITableCompProps>(), {
    height: 300,
    headerHight: 32,
    rowHeight: 28,
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
    const scrollBarYWrapper = selector.querySelector('.canvas-table-scrolly-box') as HTMLCanvasElement
    const scrollBarY = scrollBarYWrapper.querySelector('.canvas-table-scrolly-bar') as HTMLElement
    if (!scrollBarYWrapper || !scrollBarY) {
        throw new Error('组件加载失败...')
    }
    const clientWidth = selector.clientWidth
    new CanvasTable({
        canvas: canvas,
        table: props,
        clientWidth,
        scrollBarY,
    })
})

</script>

<style lang="less" scoped>
.phoenix_canvas-table--container{
    position: relative;
    font-size: 0;
    .canvas-table-scrolly-box{
        position: absolute;
        right: 0;
        bottom: 0;
        width: var(--bar-width);
        overflow: hidden;
        .canvas-table-scrolly-bar{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 4px);
            cursor: pointer;
            background-color: var(--primary-color);
            opacity: 0.6;
            border-radius: 100px;
            &:hover{
                opacity: 1;
            }
        }
    }
}
</style>
