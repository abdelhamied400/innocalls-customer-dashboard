import type { ChannelType } from "@/types/omnichannel";

export type ConfigField = {
  key: string;
  label: string;
  type: "text" | "password" | "url" | "number" | "boolean" | "select" | "list";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type SetupStep = {
  title: string;
  description: string;
  externalUrl?: string;
};

export type ChannelSetupConfig = {
  /** If true, connection is handled via OAuth popup — no manual fields needed for initial connect */
  oauth: boolean;
  fields: ConfigField[];
  steps: SetupStep[];
};

/**
 * Channels that use OAuth popup for initial connection.
 * The user clicks "Connect", a popup opens to the provider's login,
 * the backend handles the callback and creates the channel automatically.
 */
export const oauthChannels: ChannelType[] = [
  "whatsapp",
  "messenger",
  "instagram",
];

export const channelSetupConfigs: Record<ChannelType, ChannelSetupConfig> = {
  whatsapp: {
    oauth: true,
    steps: [
      {
        title: "Connect your WhatsApp Business",
        description:
          "Click the button below to open Meta's signup flow. You'll select your WhatsApp Business Account and link a phone number — we handle the rest automatically.",
      },
      {
        title: "Complete the setup",
        description:
          "Follow the prompts in the popup window to grant access to your WhatsApp Business Account. Once done, the popup will close and your channel will be connected.",
      },
    ],
    fields: [],
  },

  messenger: {
    oauth: true,
    steps: [
      {
        title: "Connect your Facebook Page",
        description:
          "Click the button below to connect via Facebook. You'll select the Page you want to receive Messenger messages from.",
      },
      {
        title: "Complete the setup",
        description:
          "Grant the required permissions in the popup. Once done, your Messenger channel will be connected automatically.",
      },
    ],
    fields: [],
  },

  instagram: {
    oauth: true,
    steps: [
      {
        title: "Connect your Instagram Business Account",
        description:
          "Click the button below to connect via Meta. Make sure your Instagram account is a Business or Creator account linked to a Facebook Page.",
      },
      {
        title: "Complete the setup",
        description:
          "Grant the required permissions in the popup. Once done, your Instagram DMs will be connected automatically.",
      },
    ],
    fields: [],
  },

  live_chat: {
    oauth: false,
    steps: [
      {
        title: "Customize your widget",
        description:
          "Set the welcome message visitors see, and the domains where this widget is allowed to load.",
      },
      {
        title: "Copy your widget token",
        description:
          "Paste this token into your site's <ChatWidget> component to start receiving live chats.",
      },
    ],
    fields: [
      {
        key: "welcomeMessage",
        label: "Welcome Message",
        type: "text",
        required: true,
        placeholder: "Hello! How can we help you today?",
      },
      {
        key: "allowedDomains",
        label: "Allowed Domains",
        type: "list",
        required: true,
        placeholder: "e.g. example.com",
      },
    ],
  },

  voice: {
    oauth: false,
    steps: [
      {
        title: "Verify Innocalls setup",
        description:
          "Voice is powered by your existing Innocalls infrastructure. Confirm your SIP server details below.",
      },
      {
        title: "Configure extensions",
        description:
          "Define the extension range and recording preferences for omnichannel voice agents.",
      },
    ],
    fields: [
      {
        key: "sipServer",
        label: "SIP Server",
        type: "text",
        required: true,
        placeholder: "sip.innocalls.com",
      },
      {
        key: "sipPort",
        label: "SIP Port",
        type: "number",
        required: true,
        placeholder: "5060",
      },
      {
        key: "extensionRange",
        label: "Extension Range",
        type: "text",
        required: true,
        placeholder: "1000-1099",
      },
      {
        key: "recordCalls",
        label: "Record Calls",
        type: "boolean",
        required: false,
      },
    ],
  },

  x: {
    oauth: false,
    steps: [
      {
        title: "Create an X Developer App",
        description:
          "Go to the X Developer Portal and create a new project and app.",
        externalUrl: "https://developer.x.com/en/portal/dashboard",
      },
      {
        title: "Configure permissions",
        description:
          "Enable OAuth 1.0a with Read and Write + Direct Messages permissions.",
      },
      {
        title: "Generate keys and tokens",
        description:
          "Generate API Key, API Secret, Access Token, Access Token Secret, and Bearer Token.",
      },
      {
        title: "Enter your credentials below",
        description: "Fill in all the generated keys and tokens.",
      },
    ],
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "Your X API key",
      },
      {
        key: "apiSecret",
        label: "API Secret",
        type: "password",
        required: true,
        placeholder: "Your X API secret",
      },
      {
        key: "accessToken",
        label: "Access Token",
        type: "password",
        required: true,
        placeholder: "OAuth 1.0a access token",
      },
      {
        key: "accessTokenSecret",
        label: "Access Token Secret",
        type: "password",
        required: true,
        placeholder: "OAuth 1.0a access token secret",
      },
      {
        key: "bearerToken",
        label: "Bearer Token",
        type: "password",
        required: true,
        placeholder: "App-only bearer token",
      },
    ],
  },

  telegram: {
    oauth: false,
    steps: [
      {
        title: "Create a Telegram Bot",
        description:
          "Open Telegram and start a chat with @BotFather. Send /newbot and follow the prompts.",
        externalUrl: "https://t.me/BotFather",
      },
      {
        title: "Copy bot credentials",
        description:
          "After creation, BotFather will give you a Bot Token (format: 123456:ABC-DEF...). Also note the bot username.",
      },
      {
        title: "Enter your credentials below",
        description:
          "Fill in the bot token and username. The webhook will be configured automatically after saving.",
      },
    ],
    fields: [
      {
        key: "botToken",
        label: "Bot Token",
        type: "password",
        required: true,
        placeholder: "123456:ABC-DEF1234ghIkl-zyx57W2v...",
      },
      {
        key: "botUsername",
        label: "Bot Username",
        type: "text",
        required: true,
        placeholder: "e.g. mycompany_support_bot",
      },
    ],
  },
};
