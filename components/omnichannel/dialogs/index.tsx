"use client";

import type { Channel } from "@/types/omnichannel";
import GenericChannelSetupDialog from "../ChannelSetupDialog";
import OAuthSetupDialog from "./OAuthSetupDialog";
import TelegramSetupDialog from "./TelegramSetupDialog";
import { oauthChannels } from "../channelSetupConfig";

type Props = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

/**
 * Routes the dialog by channel type:
 *  • OAuth channels (WhatsApp, Messenger, Instagram, X) → single-screen
 *    OAuth dialog (click → wait → done).
 *  • Telegram → single-screen credential dialog (same shape as OAuth).
 *  • Anything else (Live Chat) → multi-step generic wizard, which still
 *    earns its keep because of the post-create widget token reveal.
 */
const ChannelSetupDialog = (props: Props) => {
  if (props.channel && oauthChannels.includes(props.channel.type)) {
    return <OAuthSetupDialog {...props} />;
  }
  if (props.channel?.type === "telegram") {
    return <TelegramSetupDialog {...props} />;
  }
  return <GenericChannelSetupDialog {...props} />;
};

export default ChannelSetupDialog;
