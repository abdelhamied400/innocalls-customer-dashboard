/**
 * Logger utility class for development debugging
 * Provides colored, namespaced logging that only shows in development
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface LoggerConfig {
  enabled: boolean;
  colors: {
    [key: string]: string;
  };
}

class Logger {
  private config: LoggerConfig | null = null;
  private namespace: string;
  private color: string | null = null;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  /**
   * Initialize config only when needed (lazy initialization)
   */
  private initializeConfig(): void {
    if (this.config !== null) return;

    this.config = {
      enabled: process.env.NODE_ENV === "development",
      colors: {
        // Predefined colors for different namespaces
        webrtc: "#00bcd4", // cyan
        sip: "#4caf50", // green
        call: "#ff9800", // orange
        session: "#9c27b0", // purple
        audio: "#f44336", // red
        navigation: "#2196f3", // blue
        connection: "#795548", // brown
        default: "#607d8b", // blue grey
      },
    };

    // Get color for namespace or use default
    this.color =
      this.config.colors[this.namespace.toLowerCase()] ||
      this.config.colors.default;
  }

  /**
   * Create a logger instance with a specific namespace
   */
  static create(namespace: string): Logger {
    return new Logger(namespace);
  }

  /**
   * Format the log message with namespace and styling
   */
  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): [string, ...any[]] {
    this.initializeConfig();
    if (!this.config!.enabled) return ["", ...args];

    const timestamp = new Date().toISOString().substr(11, 12);
    const levelIcon = this.getLevelIcon(level);

    // Create styled namespace badge
    const namespaceStyle = `
      background: ${this.color}; 
      color: white; 
      padding: 2px 6px; 
      border-radius: 3px; 
      font-weight: bold;
      font-size: 11px;
    `;

    const timeStyle = `
      color: #666; 
      font-size: 11px;
    `;

    return [
      `%c${this.namespace}%c %c${timestamp}%c ${levelIcon} ${message}`,
      namespaceStyle,
      "",
      timeStyle,
      "",
      ...args,
    ];
  }

  private getLevelIcon(level: LogLevel): string {
    const icons = {
      log: "📝",
      info: "ℹ️",
      warn: "⚠️",
      error: "❌",
      debug: "🐛",
    };
    return icons[level] || "📝";
  }

  /**
   * Log a general message
   */
  log(message: string, ...args: any[]): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("log", message, ...args);
    console.log(...formatted);
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: any[]): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("info", message, ...args);
    console.info(...formatted);
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: any[]): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("warn", message, ...args);
    console.warn(...formatted);
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: any[]): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("error", message, ...args);
    console.error(...formatted);
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: any[]): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("debug", message, ...args);
    console.debug(...formatted);
  }

  /**
   * Create a scoped logger for a specific feature
   */
  scope(scope: string): Logger {
    return new Logger(`${this.namespace}:${scope}`);
  }

  /**
   * Group related logs together
   */
  group(label: string, collapsed: boolean = false): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    const formatted = this.formatMessage("log", label);
    if (collapsed) {
      console.groupCollapsed(...formatted);
    } else {
      console.group(...formatted);
    }
  }

  /**
   * End a log group
   */
  groupEnd(): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    console.groupEnd();
  }

  /**
   * Log execution time of a function
   */
  time(label: string): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    console.time(`${this.namespace}:${label}`);
  }

  /**
   * End time logging
   */
  timeEnd(label: string): void {
    this.initializeConfig();
    if (!this.config!.enabled) return;
    console.timeEnd(`${this.namespace}:${label}`);
  }
}

export const webrtcLogger = Logger.create("WebRTC");
export const paymentLogger = Logger.create("Payment");
export const apiLogger = Logger.create("API");

export default Logger;
