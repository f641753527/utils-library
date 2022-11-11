# lodash

## 常用工具库

### 快速开始

#### 安装
```javascript
  npm i @phoenix_fan/lodash
```

#### 快速上手
```javascript
import { filter } from '@phoenix_fan/lodash'

const list = [
	{ id: null, name: 'Phoenix' },
	{ id: 1, name: 'Lebrown' },
]
const newList = filter(list, v => !!v.id)
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
		<script src="node_modules/@phoenix_fan/lodash/lib/index.umd.js"></script>
	</head>
	<body>
		<div id="root">
			<web-button type="primary" size="middle">这是按钮</web-button>
		</div>
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


