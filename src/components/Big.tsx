import React from 'react'
import './Big.css'

interface Props {
    children: string | JSX.Element | Array<JSX.Element>
}

export default (props: Props) => {
    const { children } = props
    return <div className="Big">{children}</div>
}