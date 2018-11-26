import React from 'react'
import './CardBody.css'

interface Props {
    children: string | JSX.Element | Array<JSX.Element>
    centered?: boolean
}

export default (props: Props) => {
    const { centered } = props
    return (
        <div className={`CardBody ${centered ? 'centered' : 'left'}`}>
            {props.children}
        </div>
    )
}