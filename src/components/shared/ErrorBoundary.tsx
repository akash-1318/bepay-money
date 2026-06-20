import { Component } from 'preact';
import type { ComponentChild } from 'preact';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ComponentChild;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: any, errorInfo: any) {
        console.error('ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in duration-200">
                    <div className="flex items-center justify-center size-14 bg-red-50 border border-red-100 text-red-500 rounded-full mb-4">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold text-black mb-2 font-sans">Something went wrong</h2>
                    <p className="text-sm text-text-secondary max-w-md mb-6 leading-relaxed font-sans">
                        {this.props.fallbackMessage || 'An unexpected error occurred while rendering this page. Please try reloading or returning home.'}
                    </p>
                    
                    {this.state.error && (
                        <div className="w-full max-w-lg bg-gray-50 border border-gray-150 rounded-lg p-3 text-left mb-6 overflow-x-auto">
                            <p className="text-xs font-mono font-semibold text-red-600 mb-1">
                                {this.state.error.name}: {this.state.error.message}
                            </p>
                            <pre className="text-[10px] font-mono text-gray-500 leading-normal max-h-36 overflow-y-auto">
                                {this.state.error.stack}
                            </pre>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={this.handleReset}
                            className="btn-primary h-10 px-5 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reload Page</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = '/';
                            }}
                            className="h-10 px-5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg text-sm"
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
