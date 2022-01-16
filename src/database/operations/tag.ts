import { ArtworkTag } from "~/types/Artwork";
import Mongoose from "..";
import TagModel from "../models/TagModel"

export async function insertTag(tag_name: string): Promise<ArtworkTag> {
    let tag_instance = new TagModel({
        _id: new Mongoose.Types.ObjectId(),
        name: tag_name
    })

    let tag: ArtworkTag = await tag_instance.save()

    return tag
}

export async function getTagById(id: string): Promise<ArtworkTag> {
    let tag = await TagModel.findOne({
        _id: id
    })

    if (tag) return tag

    throw new Error("Tag id not found")
}

export async function getTagByName(name: string): Promise<ArtworkTag> {
    let tag = await TagModel.findOne({
        name: name
    })

    if (tag) return tag

    throw new Error("Tag name not found")
}

export async function getTagsByNamesAndInsert(tag_names: Array<string>): Promise<Array<ArtworkTag>> {
    let tag_array: Array<ArtworkTag> = []
    for (let tag_name of tag_names) {
        try {
            let found_tag = await getTagByName(tag_name)
            tag_array.push(found_tag)
        }
        catch (err) {
            let new_tag = await insertTag(tag_name)
            tag_array.push(new_tag)
        }
    }
    return tag_array
}