import ContributionModel from '~/database/models/CountributionModel';
import { Contribution } from '~/types/Contribution';

export async function addContribution(
    contribution: Contribution
): Promise<Contribution> {
    const contribution_model = new ContributionModel(contribution);
    const document = await contribution_model.save();
    return document;
}

export async function getContributionById(
    message_id: number
): Promise<Contribution> {
    const document = await ContributionModel.findOne({
        message_id: message_id
    });

    if (!document) {
        throw new Error('Contribution not found !');
    }

    return document;
}

export async function deleteContribution(message_id: number): Promise<number> {
    const result = await ContributionModel.deleteOne({
        message_id: message_id
    });
    return result.deletedCount;
}
