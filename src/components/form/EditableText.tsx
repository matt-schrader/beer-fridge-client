import React, { ChangeEvent, KeyboardEvent } from 'react'
import '../index.css'

interface Props {
    onEdit: (value: string) => void
    children: string | number
}

interface StateProps {
    editing: boolean
    value: string
    error?: string
}

export default class EditableText extends React.Component<Props, StateProps> {
    public constructor(props: Props) {
        super(props)
        this.state = {
            editing: false,
            value: ""
        }
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { editing } = this.state
        if (editing) {
            this.setState({
                value: event.target.value
            })
        }
    }

    private handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.closeEditing()
        }
    }

    private enterEditing = () => {
        const { children } = this.props;
        const { editing } = this.state
        this.setState({
            editing: !editing,
            value: `${children}`
        })
    }

    private closeEditing = () => {
        const { editing, value } = this.state
        const { onEdit } = this.props
        if (editing) {
            let error = false
            try {
                onEdit(value)
            } catch (err) {
                error = true
                this.setState({
                    error: err.message
                })
            }
            if (!error) {
                this.setState({
                    editing: false,
                    error: undefined
                })
            }
        }
    }

    public renderEditing() {
        const { value, error } = this.state

        return (
            <div>
                <input type="text" value={value} onChange={this.handleChange} onKeyPress={this.handleKeyPress} onBlur={this.closeEditing} autoFocus />
                {error && <div className="error">{error}</div>}
            </div>
        )
    }

    public render() {
        const { children } = this.props
        const { editing } = this.state
        if (editing) {
            return this.renderEditing()
        }

        return (
            <span onDoubleClick={this.enterEditing}>{children}</span>
        )
    }
}
