import * as PropTypes from "prop-types";
import React, { Component } from "react";

import { ERROR_CLIENT_FAILURE } from "../../helper/const";

import FatalError from "./FatalError";

/**
 * The error boundary of everything. If any component fails, then the boundary will replace the page with a nice error
 * box.
 */
class ErrorBoundary extends Component {
    state = {
        error: null,
        errorInfo: null,
    };

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.errorInfo) {
            return <FatalError type={ERROR_CLIENT_FAILURE} />;
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
