# lodash

## 常用工具库

### 快速开始

#### 安装
```javascript
  npm i @phoenix_fan/lodash-es
```

#### 快速上手

##### Array.filter
```javascript
import { filter } from '@phoenix_fan/lodash-es'

const list = [
	{ id: null, name: 'Phoenix' },
	{ id: 1, name: 'Lebrown' },
]
const newList = filter(list, v => !!v.id)
```

##### Array.sort

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

#### 浏览器中使用
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


