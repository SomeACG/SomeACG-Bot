import { CommandEntity } from '~/types/Command';

export function parseParams(command: string): CommandEntity {
    command = command.trim();
    if (command.search(' ') == -1)
        return {
            name:
                command.search('@') == -1
                    ? command.substring(1)
                    : command.split('@')[0].substring(1),
            params: new Object()
        };
    const str_array = command.split(' ');
    let last_param_index = 0;
    if (str_array[str_array.length - 1].search('=') != -1) {
        last_param_index = str_array.length - 1;
    } else {
        last_param_index = str_array.length - 2;
    }

    const command_entity: CommandEntity = {
        name:
            str_array[0].search('@') == -1
                ? str_array[0].substring(1)
                : str_array[0].split('@')[0].substring(1),
        params: new Object(),
        target:
            last_param_index == str_array.length - 1
                ? undefined
                : str_array[last_param_index + 1]
    };

    // command_entity.params = last_param_index == 0 ? {} : []
    for (let i = 1; i <= last_param_index; i++) {
        const urlPattern = new RegExp('/(http)?(:\/\/)?.*\.(com|net).*/g');
        if (!urlPattern.test(str_array[i])) {
            const param_key = str_array[i].split('=')[0];
            const param_value = str_array[i].split('=')[1];
        command_entity.params[param_key] = param_value;
        }
    }
    return command_entity;
}