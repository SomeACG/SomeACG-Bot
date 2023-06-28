import ConfigModel from '../models/ConfigModel';

export async function getConfig(name: string): Promise<string> {
    const result = await ConfigModel.findOne({ name });
    return result?.value ?? '';
}

export async function setConfig(name: string, value: string): Promise<void> {
    const result = await ConfigModel.findOne({ name });
    if (result) {
        result.value = value;
        await ConfigModel.updateOne({ name }, result, {
            session: global.currentMongoSession
        });
    } else {
        const config = new ConfigModel({
            name,
            value
        });

        await config.save();
    }
}
