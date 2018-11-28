import React, { ChangeEvent, KeyboardEvent } from 'react'
import '../index.css'
import './EditableText.css'

interface Props {
    onEdit: (value: string) => void
    children: string | number
    editing: boolean
}

interface StateProps {
    value: string
    error?: string
}

export default class EditableText extends React.Component<Props, StateProps> {
    public constructor(props: Props) {
        super(props)
        this.state = {
            value: ""
        }
    }

    public componentWillReceiveProps(next: Props) {
        const { editing } = this.props
        if (!editing && next.editing) {
            this.enterEditing()
        } else if (editing && !next.editing) {
            this.closeEditing()
        }
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { editing } = this.props
        if (editing) {
            this.setState({
                value: event.target.value
            })
        }
    }

    private enterEditing = () => {
        const { children } = this.props;
        this.setState({
            value: `${children}`
        })
    }

    private closeEditing = () => {
        const { value } = this.state
        const { editing, onEdit } = this.props
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
                    error: undefined
                })
            }
        }
    }

    public renderEditing() {
        const { value, error } = this.state

        return (
            <span className="EditableText">
                <input type="text" value={value} onChange={this.handleChange} autoFocus />
                {error && <div className="error">{error}</div>}
            </span>
        )
    }

    public render() {
        const { children, editing } = this.props
        if (editing) {
            return this.renderEditing()
        }

        return (
            <span className="EditableText">{children}</span>
        )
    }
}
