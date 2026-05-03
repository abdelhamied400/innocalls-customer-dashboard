import type { ChannelType } from "@/types/omnichannel";
import { WhatsApp, Chat, Facebook, Telegram } from "@mui/icons-material";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";

type ChannelIconProps = {
  channel: ChannelType;
  className?: string;
};

const iconMap: Record<ChannelType, React.ElementType> = {
  whatsapp: WhatsApp,
  live_chat: Chat,
  messenger: Facebook,
  x: XIcon,
  instagram: InstagramIcon,
  telegram: Telegram,
};

const colorMap: Record<ChannelType, string> = {
  whatsapp: "text-green-500",
  live_chat: "text-purple-500",
  messenger: "text-blue-600",
  x: "text-gray-900",
  instagram: "text-pink-500",
  telegram: "text-sky-500",
};

export const channelLabels: Record<ChannelType, string> = {
  whatsapp: "WhatsApp",
  live_chat: "Live Chat",
  messenger: "Messenger",
  x: "X",
  instagram: "Instagram",
  telegram: "Telegram",
};

const ChannelIcon = ({ channel, className = "" }: ChannelIconProps) => {
  const Icon = iconMap[channel];
  const color = colorMap[channel];

  return <Icon className={`${color} ${className}`} />;
};

export default ChannelIcon;
