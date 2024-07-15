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

### 用法
**Props**
| 属性      | 说明          | 类型         | 默认值          |
|-----------|--------------|--------------|:--------------:|
| el | 挂在节点 | String | - |
| data | 渲染组件数据 | Array | - |
| column | 渲染组件表格列 | Array | - |
| height | 渲染组件高度 | number | - |
| rowHeight | 行高 |  number 、 row => number | - |

**events**
| 事件名称      | 说明          | 回调参数         |
|-----------|--------------|--------------|
| onCellClick | 鼠标点击单元格时触发该事件 |  cell  |
| onCellMove | 鼠标移动事件 |    |

**Methods **
| 方法名称      | 说明          | 参数         |
|-----------|--------------|--------------|
| setData | 重新设置表格渲染数据 |  cell  |
| setColumns | 重新设置表格列 |    |


**Props.column 配置说明（自定义列配置）**
| 属性      | 说明          | 类型         | 默认值          |
|-----------|--------------|--------------|:--------------:|
| show | 是否显示列 | Boolean | false |
| label | 列中文名 | String | - |
| key | 列字段名 | String | - |
| width | 列宽 | number | - |
| fixed | 是否固定列 | "left" \| "right" | - |
| headerTooltip | 表头气泡 | string \| () => string | - |
| tooltip | 单元格气泡 | string \| ({ row }) => string | - |

