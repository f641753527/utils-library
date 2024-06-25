<template>
    <div id="app">
        <Table
            :data="tableData"
            :columns="columns"
        />
    </div>
</template>

<script setup lang="ts">
import Table from './index.js'
import { generateRandomChineseChar } from './utils'

const columns = [
    { label: "姓名", key: "name", width: 120 },
    { label: "年龄", key: "age", width: 120 },
    { label: "学校", key: "school", width: 120 },
    { label: "分数", key: "source", width: 120 },
    { label: "操作", key: "options", minWidth: 120 }
]
const tableData = new Array(30).fill(null).map(v => ({
    id: ~~(Math.random() * 999999999),
    name: generateRandomChineseChar(~~(Math.random() * 2) + 2),
    age: ~~(Math.random() * 99),
    school: generateRandomChineseChar(~~(Math.random() * 10) + 5),
    source: ~~(Math.random() * 150),
}))

</script>
