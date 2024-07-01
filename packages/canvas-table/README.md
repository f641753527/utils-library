## 上万行数据渲染之终极方案：canvas-table

### 安装
```javascript
  npm i @phoenix_fan/canvas-table
```

### React 中使用 
```React
import React, { useState, useEffect } from 'react';
import CanvasTable from "@phoenix_fan/canvas-table";
/** 引入样式 */
import "@phoenix_fan/canvas-table/lib/index.css";

export default function App() {
    const columns = [
      { label: "序号", key: "index", width: 40 },
      { label: "姓名", key: "name", width: 120 },
      { label: "年龄", key: "age", width: 120 },
      { label: "学校", key: "school", width: 120 },
      { label: "分数分数分数分数分数分数分数分数", key: "source", width: 120 },
      { label: "操作", key: "options", minWidth: 120 },
    ]
    const [data, setData] = useState([]);
    
    const getData = () => {
      return new Promise(resolve => setTimeout(() => {
        const data = new Array(200).fill(null).map((v, i) => ({
          id: ~~(Math.random() * 999999999),
          index: i + 1,
          name: '你好啊',
          age: ~~(Math.random() * 99),
          school: '五道口职业技术学院',
          source: ~~(Math.random() * 150),
        }))
        resolve(data);
      }, 200));
    }
    
    const instance = new Table({
      el: "#app",
      data: data,
      columns,
    })
    
    useEffect(() => {
        getData().then(res => {
            setData(res);
            instance.setData(res);
        })
    }, [])
  
  return (
    <div id="app"></div>
  );
}

```

### Vue中使用 
```vue
<template>
  <div id="app"></div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import CanvasTable from "@phoenix_fan/canvas-table";
/** 引入样式 */
import "@phoenix_fan/canvas-table/lib/index.css";

const data = ref([]);

const columns = [
  { label: "序号", key: "index", width: 60 },
  { label: "姓名", key: "name", width: 120 },
  { label: "年龄", key: "age", width: 120 },
  { label: "学校", key: "school", width: 120 },
  { label: "分数分数分数分数分数分数分数分数", key: "source", width: 120 },
  { label: "操作", key: "options", minWidth: 120 },
]

const getData = () => {
  return new Promise(resolve => setTimeout(() => {
    const data = new Array(200).fill(null).map((v, i) => ({
      id: ~~(Math.random() * 999999999),
      index: i + 1,
      name: '你好啊',
      age: ~~(Math.random() * 99),
      school: '五道口职业技术学院',
      source: ~~(Math.random() * 150),
    }))
    resolve(data);
  }, 200));
}

getData().then(res => data.value = res)



const instance = new Table({
  el: "#app",
  data: tableData,
  columns,
})

watch(data, () => {
  instance.setData(res);
})

</script>

```

### 浏览器中使用 
```html
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Table</title>
		<link rel="stylesheet" href="node_modules/@phoenix_fan/canvas-table/lib/index.css">
    <script src="node_modules/@phoenix_fan/canvas-table/lib/index.umd.js" ></script>
	</head>
	<body>
    <div id="app"></div>


	<script>
    const columns = [
    { label: "序号", key: "index", width: 60 },
    { label: "姓名", key: "name", width: 120 },
    { label: "年龄", key: "age", width: 120 },
    { label: "学校", key: "school", width: 120 },
    { label: "分数分数分数分数分数分数分数分数", key: "source", width: 120 },
    { label: "操作", key: "options", minWidth: 120 }
    ]

      const tableData = new Array(30).fill(null).map((v, i) => ({
        id: ~~(Math.random() * 999999999),
        index: i + 1,
        name: '你好啊',
        age: ~~(Math.random() * 99),
        school: '五道口职业技术学院',
        source: ~~(Math.random() * 150),
      }))

      const instance = new Table({
        el: "#app",
        data: tableData,
        columns,
      })
		</script>
	</body>
</html>

```

### 效果图

![效果图](https://github.com/f641753527/utils-library/blob/master/packages/canvas-table/public/static/screen.jpg)
