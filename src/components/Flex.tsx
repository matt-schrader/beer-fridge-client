import React from 'react'
import { BeerChildProps } from '..';
import Spacer, { SpacerProps } from './Spacer';

interface OwnProps {
    children: BeerChildProps
}

type Props = OwnProps & SpacerProps
export default (props: Props) => {
    const { children, ...rest } = props
    return (
        <div className="flex1">
            <Spacer {...rest}>
                {children}
            </Spacer>
        </div>
    )
}