import React from 'react'
import './Card.css'

interface Props {
    children: JSX.Element | Array<JSX.Element>
}

export default (props: Props) => {
    return (
        <div className="Card">
            {props.children}
        </div>
    )
}