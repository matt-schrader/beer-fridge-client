import React from 'react'
import './Card.css'

interface Props {
    modal?: boolean
    children: JSX.Element | Array<JSX.Element>
}

export default (props: Props) => {
    const { modal } = props
    const classes = `Card ${modal ? 'Modal' : ''}`
    return (
        <div className={classes}>
            {props.children}
        </div>
    )
}