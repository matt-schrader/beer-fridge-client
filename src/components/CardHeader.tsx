import React from 'react'
import './CardHeader.css'

interface Props {
    children: JSX.Element | Array<JSX.Element> | string
}

export default (props: Props) => {
    return (
        <div className="CardHeader">
            {props.children}
        </div>
    )
}