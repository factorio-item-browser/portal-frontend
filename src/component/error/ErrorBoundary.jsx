// @flow

import React, { Component } from "react";
import { ERROR_CLIENT_FAILURE } from "../../const/error";
import FatalError from "./FatalError";

type Props = {
    children: React$Node,
};

type State = {
    error: ?Error,
};

/**
 * The error boundary of everything. If any component fails, then the boundary will replace the page with a nice error
 * box.
 */
class ErrorBoundary extends Component<Props, State> {
    state: State = {
        error: null,
    };

    componentDidCatch(error: Error): void {
        this.setState({ error });
    }

    render(): React$Node {
        if (this.state.error) {
            return <FatalError type={ERROR_CLIENT_FAILURE} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
