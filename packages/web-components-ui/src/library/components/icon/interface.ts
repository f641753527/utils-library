import React from 'react'

export const tagName = 'web-icon'

export interface IconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
	name: number
}
