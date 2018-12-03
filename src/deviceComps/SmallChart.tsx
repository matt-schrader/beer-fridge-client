import React from 'react'
import { AreaClosed } from '@vx/shape'
import moment from 'moment'
import { scaleTime, scaleLinear } from '@vx/scale';
import './SmallChart.css'
import ReactResizeDetector from 'react-resize-detector';

interface Props {
    logs: Array<any>
}

interface OwnState {
    height: number
    width: number
}

const xLog = (log: any) => {
    return moment(log.time).toDate()
}
const yLog = (log: any) => {
    return log.temperature
}
const min = (arr: any, fn: any) => Math.min(...arr.map(fn));
const max = (arr: any, fn: any) => Math.max(...arr.map(fn));
const extent = (arr: Array<any>, fn: any) => [min(arr, fn), max(arr, fn)];

export default class SmallChart extends React.Component<Props, OwnState> {
    private svgRef?: SVGSVGElement
    public state = {
        height: 0,
        width: 0,
    }

    private onResize = () => {
        this.updateDimensions()
    }

    private svgRefHandler = (ref: SVGSVGElement) => {
        this.svgRef = ref
        this.updateDimensions()
    }

    private updateDimensions() {
        if (!this.svgRef) {
            return
        }

        this.setState({
            width: this.svgRef.clientWidth,
            height: this.svgRef.clientHeight,
        })
    }

    public render() {
        const { logs } = this.props
        const { height, width } = this.state;
        const xMax = width;
        const xScale = scaleTime({
            range: [0, xMax],
            domain: extent(logs, xLog)
        });

        const yMax = height;
        const yScale = scaleLinear({
            range: [yMax, 0],
            domain: extent(logs, yLog)
        })

        return (
            <ReactResizeDetector handleHeight handleWidth onResize={this.onResize}>
                <svg className="SmallChart" ref={this.svgRefHandler}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <AreaClosed
                        data={logs}
                        x={(d: any) => xScale(xLog(d))}
                        y={(d: any) => yScale(yLog(d))}
                        yScale={yScale}
                        strokeWidth={1}
                        stroke={'url(#gradient)'}
                        fill={'url(#gradient)'}
                        // curve={curveMonotoneX}
                    />
                </svg>
            </ReactResizeDetector>
        )
    }
}
