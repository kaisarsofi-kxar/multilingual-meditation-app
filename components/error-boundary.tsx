import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ErrorBoundaryProps {
  children: ReactNode;
  title: string;
  message: string;
  retryLabel: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (__DEV__) {
      console.error(error, info.componentStack);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            {this.props.title}
          </ThemedText>
          <ThemedText style={styles.message}>{this.props.message}</ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRetry}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>{this.props.retryLabel}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    opacity: 0.85,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
