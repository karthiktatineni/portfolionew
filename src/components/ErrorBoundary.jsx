import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-red-500 p-8 flex flex-col items-center justify-center font-mono text-xs">
                    <h1 className="text-xl mb-4 text-white">Application Crashed</h1>
                    <p className="mb-2">{this.state.error && this.state.error.toString()}</p>
                    <pre className="bg-[#111] p-4 rounded max-w-full overflow-auto text-gray-400">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-full uppercase tracking-widest font-bold"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
