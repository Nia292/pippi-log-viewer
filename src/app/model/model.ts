// DM = [PlayerA:PlayerB]
// Local = [Local]
// Clan = [ClanName]
// none = not a chat message
export type ChatChannelType = 'DM' | 'Global' | 'Local' | 'Clan' | 'none';

export interface LogEntry {
  // The original message
  msg: string;
  chatMessage: string;
  // When was the message recorded?
  timestamp: Date;
  type: ChatChannelType;
  // If type is either DM, Local or Clan, the chat channel name is given here
  // If it's clan, it's the clan's name
  // If it's local -> it's "local"
  // If it's DM it is the name of both players [PlayerA:PlayerB]
  chatChannel: string;
  sendingPlayer: string;
}
