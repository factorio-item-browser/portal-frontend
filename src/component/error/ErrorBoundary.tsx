import React, { Component, ReactNode } from "react";
import { ERROR_CLIENT_FAILURE } from "../../const/error";
import FatalError from "./FatalError";

type Props = {
    children: ReactNode;
};

type State = {
    error: Error | null;
};

/**
 * The error boundary of everything. If any component fails, then the boundary will replace the page with a nice error
 * box.
 */
class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        error: null,
    };

    public componentDidCatch(error: Error): void {
        this.setState({ error });
    }

    public render(): ReactNode {
        if (this.state.error) {
            return <FatalError type={ERROR_CLIENT_FAILURE} />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
