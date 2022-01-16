import Mongoose from "~/database";
import { Contribution } from "~/types/Contribution";
import { ArtworkInfo } from "~/types/Artwork";

const contributionSchema = new Mongoose.Schema<Contribution>({
    post_url: String,
    chat_id: Number,
    user_id: Number,
    user_name: String,
    message_id: Number,
    reply_message_id: Number,
    create_time: {
        type: Date,
        default: new Date()
    }
})

const ContributionModel = Mongoose.model('Contribution', contributionSchema)

export default ContributionModel