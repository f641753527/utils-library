# monorepo 记录常用工具库

## canvas-table 上万行数据渲染之终极方案：canvas-table

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


## lodash 篇

### 安装
```javascript
  npm i @phoenix_fan/lodash-es
```

#### Array.filter
```javascript
import { filter } from '@phoenix_fan/lodash-es'

const list = [
	{ id: null, name: 'Phoenix' },
	{ id: 1, name: 'Lebrown' },
]
const newList = filter(list, v => !!v.id)
```

#### Array.sort

```javascript
import { sortByField } from '@phoenix_fan/lodash-es'

const list = [
  {
    age: 18,
    height: 172,
    name: '蔡徐坤'
  },
  {
    age: 18,
    height: 170,
    name: '张艺兴'
  },
  {
    age: 16,
    height: 160,
    name: '王心凌'
  },
  {
    age: 16,
    height: 160,
    name: '田馥甄'
  },
]
/**
优先按年龄升序（不传排序规则默认升序）
再按身高将序
最后按名字升序
*/

list.sort(sortByField({
  field: 'age',
  next: sortByField({
    field: 'height',
    sortRule: (a, b) => (b.height - a.height),
    next: sortByField({
      field: 'name', 
      sortRule: (a, b) => a.name.localeCompare(b.name)
    })
  })
}))
```

### 浏览器中使用
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
  		<meta charset="UTF-8">
  		<meta http-equiv="X-UA-Compatible" content="IE=edge">
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<title>Lodash</title>
		<script src="node_modules/@phoenix_fan/lodash-es/lib/index.umd.js"></script>
	</head>
	<body>
		<script>
			const { filter } = _
			
			const list = [
				{ id: null, name: 'Phoenix' },
				{ id: 1, name: 'Lebrown' },
			]
			const newList = filter(list, v => !!v.id)
		</script>
	</body>
</html>
```

## web components 篇


### 跨技术栈UI组件库,支持UMD，浏览器原生支持


#### 安装
```javascript
  npm i @phoenix_fan/web-components-ui
```

#### 快速上手
```javascript
import { Button } from '@phoenix_fan/web-components-ui'
Button.regist()

// template
<web-button type="primary" size="middle">这是按钮</web-button>
```

#### 浏览器中使用
```javascript
<!DOCTYPE html>
<html lang="en">
	<head>
  		<meta charset="UTF-8">
  		<meta http-equiv="X-UA-Compatible" content="IE=edge">
  		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<title>Web Component</title>
		<script src="node_modules/@phoenix_fan/web-components-ui/lib/index.umd.js"></script>
	</head>
	<body>
		<div id="root">
			<web-button type="primary" size="middle">这是按钮</web-button>
		</div>
		<script>
			const { Button } = WebComponent
			Button.regist()
		</script>
	</body>
</html>
```
