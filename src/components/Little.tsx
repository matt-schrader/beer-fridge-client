import React from 'react'
import './Little.css'
import { BeerChildProps } from '../'
import Spacer, { SpacerProps } from './Spacer';

interface OwnProps {
    children: BeerChildProps
}

type Props = OwnProps & SpacerProps
export default (props: Props) => {
    const { children, ...rest } = props
    return <Spacer {...rest}><div className="Little">{children}</div></Spacer>
}