export type ChannelMessageType = 'photo' | 'document' | 'text';

export type ChannelMessage<T = ChannelMessageType> = {
    type: T;
    message_id: number;
    artwork_index: number;
    file_id: string;
    send_time?: Date;
};
