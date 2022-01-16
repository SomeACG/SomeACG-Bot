import { Document } from "mongoose";
import ContributionModel from "~/database/models/CountributionModel"
import { Contribution } from "~/types/Contribution";

export async function addContribution(contribution: Contribution): Promise<Contribution> {
    let contribution_model = new ContributionModel(contribution)
    let document = await contribution_model.save()
    return document
}

export async function getContributionById(message_id: number): Promise<Contribution> {
    let document = await ContributionModel.findOne({
        message_id: message_id
    })

    if(!document)
    {
        throw new Error('Contribution not found !')
    }

    return document
}

export async function deleteContribution(message_id: number): Promise<number> {
    let result = await ContributionModel.deleteOne({
        message_id: message_id
    })
    return result.deletedCount
}