export type ChannelMessageType = 'photo' | 'document' | 'text';

export type ChannelMessage = {
    type: ChannelMessageType;
    message_id: number;
    artwork_index: number;
    file_id: string;
    send_time?: Date;
};
