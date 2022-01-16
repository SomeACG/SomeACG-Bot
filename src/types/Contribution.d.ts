import { ArtworkInfo } from "./Artwork";

export type Contribution = {
    post_url: string
    chat_id: number
    user_id: number
    user_name: string
    message_id: number
    reply_message_id: number
    create_time: Date
}