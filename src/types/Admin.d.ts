export const enum AdminPermission {
    DEFAULT = 'DEFAULT',
    PUBLISH = 'PUBLISH',
    TAG = 'TAG',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    GRANT = 'GRANT'
}

export type AdminUser = {
    user_id: number
    grant_by: number,
    permissions: Array<AdminPermission>
    create_time?: Date
}