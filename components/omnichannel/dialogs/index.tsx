"use client";

import type { Channel } from "@/types/omnichannel";
import GenericChannelSetupDialog from "../ChannelSetupDialog";
import XSetupDialog from "./XSetupDialog";

type Props = {
  channel: Channel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

/**
 * Router for the per-channel setup dialog. X has its own bespoke component;
 * everything else still goes through the config-driven generic dialog.
 * Pull additional channel types out into their own files as their UX
 * diverges from the generic one.
 */
const ChannelSetupDialog = (props: Props) => {
  if (props.channel?.type === "x") {
    return <XSetupDialog {...props} />;
  }
  return <GenericChannelSetupDialog {...props} />;
};

export default ChannelSetupDialog;
