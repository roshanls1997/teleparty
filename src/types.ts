export type userSettingsType = {
  userIcon: string;
  userNickname: string;
};

export type messageType = {
  body: string;
  isSystemMessage: boolean;
  timestamp: number;
  permId: string;
  messageId: string;
  userSettings?: userSettingsType;
  userIcon?: string;
  userNickname?: string;
};
