import JsSIP from "jssip";
import CryptoJS from "crypto-js";

const SIP_INTERFACE = process.env.NEXT_PUBLIC_SIP_INTERFACE!;
const DECRYPT_SECRET = process.env.NEXT_PUBLIC_DECRYPT_SECRET!;

// Singleton SIP Manager to ensure only one UA instance
class SipManager {
  private static instance: SipManager;
  private ua: JsSIP.UA | null = null;
  private isDestroying = false;
  private isCreating = false;
  private currentUri: string | null = null;

  private constructor() {}

  static getInstance(): SipManager {
    if (!SipManager.instance) {
      SipManager.instance = new SipManager();
    }
    return SipManager.instance;
  }

  async destroyCurrentUA(): Promise<void> {
    if (!this.ua || this.isDestroying) {
      return;
    }

    this.isDestroying = true;

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("UA destroy timeout, forcing cleanup");
        this.forceCleanup();
        resolve();
      }, 3000);

      const cleanup = () => {
        clearTimeout(timeout);
        this.forceCleanup();
        resolve();
      };

      try {
        // Check if UA has any active sessions and terminate them
        if (this.ua && (this.ua as any)._sessions) {
          Object.values((this.ua as any)._sessions).forEach((session: any) => {
            if (session && typeof session.terminate === "function") {
              session.terminate();
            }
          });
        }

        // Listen for proper unregistration
        const onUnregistered = () => {
          this.ua?.removeListener("unregistered", onUnregistered);
          this.ua?.removeListener("disconnected", onDisconnected);
          cleanup();
        };

        const onDisconnected = () => {
          this.ua?.removeListener("unregistered", onUnregistered);
          this.ua?.removeListener("disconnected", onDisconnected);
          cleanup();
        };

        if (this.ua?.isRegistered()) {
          this.ua?.on("unregistered", onUnregistered);
          this.ua?.on("disconnected", onDisconnected);
          this.ua?.stop();
        } else {
          cleanup();
        }
      } catch (error) {
        console.error("Error during UA destruction:", error);
        cleanup();
      }
    });
  }

  private forceCleanup() {
    if (this.ua) {
      try {
        this.ua.removeAllListeners();
        this.ua.stop();
      } catch (error) {
        console.error("Error in force cleanup:", error);
      }
      this.ua = null;
    }
    this.currentUri = null;
    this.isDestroying = false;
    this.isCreating = false;
  }

  createUserAgent(uri: string, password: string): JsSIP.UA {
    process.env.NODE_ENV === "production"
      ? JsSIP.debug.disable()
      : JsSIP.debug.enable("JsSIP:*");

    const socket = new JsSIP.WebSocketInterface(SIP_INTERFACE);

    // decrypt password
    const passwordBytes = CryptoJS.AES.decrypt(password, DECRYPT_SECRET);
    const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

    const ua = new JsSIP.UA({
      sockets: [socket],
      uri,
      password: decryptedPassword,
      user_agent: "platform-webrtc",
      register: true,
      register_expires: 10,
      session_timers: true,
      no_answer_timeout: 30,
      connection_recovery_max_interval: 30,
      connection_recovery_min_interval: 2,
    });

    this.ua = ua;
    this.currentUri = uri;
    this.isDestroying = false;

    return ua;
  }

  async ensureSingleSession(uri: string, password: string): Promise<JsSIP.UA> {
    // Prevent multiple concurrent creations
    if (this.isCreating) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (this.ua && this.currentUri === uri) {
        return this.ua;
      }
    }

    // If we already have a UA for the same URI, check its connection state
    if (this.ua && this.currentUri === uri && !this.isDestroying) {
      // Only reuse if it's actually connected, otherwise create fresh
      if (this.ua.isConnected()) {
        return this.ua;
      } else {
        await this.destroyCurrentUA();
      }
    }

    // Destroy any existing UA if different URI
    if (this.ua && (this.currentUri !== uri || this.isDestroying)) {
      await this.destroyCurrentUA();
    }

    this.isCreating = true;
    try {
      const ua = this.createUserAgent(uri, password);
      this.isCreating = false;
      return ua;
    } catch (error) {
      this.isCreating = false;
      throw error;
    }
  }

  getCurrentUA(): JsSIP.UA | null {
    return this.ua;
  }

  isConnected(): boolean {
    return this.ua ? this.ua.isRegistered() : false;
  }

  async shutdown(): Promise<void> {
    await this.destroyCurrentUA();
  }
}

export const sipManager = SipManager.getInstance();
