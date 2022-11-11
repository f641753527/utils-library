import React from 'react'

export const tagName = 'web-button'

export interface ButtonProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	size?: "small" | "middle" | "large"
	type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default"
}
