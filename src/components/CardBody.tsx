import React from 'react'
import './CardBody.css'
import { BeerChildProps } from '..';

interface Props {
    children: BeerChildProps
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