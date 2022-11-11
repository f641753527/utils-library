# web-components-ui

## 跨技术栈UI组件库,支持UMD，浏览器原生支持

### 快速开始

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


