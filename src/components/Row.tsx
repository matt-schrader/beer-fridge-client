import React from 'react'
import './Row.css'

interface Props {
    children: JSX.Element | Array<JSX.Element>
}
export default (props: Props) => {
    return (
        <div className="Row">
            {props.children}
        </div>
    )
}