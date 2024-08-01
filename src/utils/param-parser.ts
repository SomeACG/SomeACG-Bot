import { CommandEntity } from '~/types/Command';
import logger from './logger';
import { MessageEntity } from 'telegraf/typings/core/types/typegram';

export function parseParams(
    command: string,
    entities?: MessageEntity[]
): CommandEntity {
    logger.debug(`parsing command: ${command}`);

    command = command.trim();

    const str_array = command.split(' ');

    const cmd_entity: CommandEntity = {
        name:
            str_array[0].indexOf('@') == -1
                ? str_array[0].slice(1)
                : str_array[0].slice(1, str_array[0].indexOf('@')),
        params: {}
    };

    if (str_array.length == 1) return cmd_entity;

    // exprimental: parse from entities

    if (entities?.length > 0) {
        cmd_entity.urls = entities
            .filter(entity => entity.type === 'url')
            .map(entity =>
                command.substring(entity.offset, entity.offset + entity.length)
            );

        cmd_entity.hashtags = entities
            .filter(entity => entity.type === 'hashtag')
            .map(entity =>
                command.substring(
                    entity.offset + 1,
                    entity.offset + entity.length
                )
            );
    }

    for (let i = 1; i < str_array.length; i++) {
        if (i == str_array.length - 1) {
            // This part is url, skip param parse
            if (cmd_entity.urls?.indexOf(str_array[i]) > -1) {
                cmd_entity.target = str_array[i];
                break;
            }
            // This part is hashtag, skip param parse
            if (cmd_entity.hashtags?.indexOf(str_array[i].slice(1)) > -1) break;

            // last part without equal sign, it's target
            if (str_array[i].indexOf('=') == -1) {
                cmd_entity.target = str_array[i];
                break;
            }
        }

        if (str_array[i].indexOf('=') > -1) {
            // parse params
            const param_pair = str_array[i].split('=');
            const param_name = param_pair.shift();

            if (param_name)
                cmd_entity.params[param_name] = param_pair.join('=');
        }
    }

    return cmd_entity;
}

export function semiIntArray(str: string): number[] {
    return str.search(',') == -1
        ? [parseInt(str)]
        : str
              .split(/,|，/)
              .map(item => parseInt(item))
              .sort((a, b) => a - b);
}
