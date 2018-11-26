import React from 'react'
import './Spacer.css'
import { BeerChildProps } from '../'

export interface SpacerProps {
    children: BeerChildProps
    padTop?: boolean
    padRight?: boolean
    padBottom?: boolean
    padLeft?: boolean
    pad?: boolean
}

function toCss(className: string, on?: boolean) {
    if (on) {
        return className
    }
    return ''
}

export default (props: SpacerProps) => {
    const { padTop, padRight, padBottom, padLeft, pad, children } = props
    const className = `${toCss('padTop', padTop)} ${toCss('padRight', padRight)} ${toCss('padBottom', padBottom)} ${toCss('padLeft', padLeft)} ${toCss('pad', pad)}`
    return (
        <div className={className}>{children}</div>
    )
}