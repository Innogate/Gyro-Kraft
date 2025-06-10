export interface permissions {
    id: string;
    module_id: string;
    can_add: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

export interface permissionCreate {
    user_id: string;
    module_id: number;
    can_add: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

export interface getPermissionByUserId {
    user_id: string;
}


export interface deletePermission {
    permission_id: string;
}

export interface getModuleListResponse {
    id: string;
    module_name: string;
    created_at: string;
    created_by: string | null;
    modified_at: string | null;
    modified_by: string | null;
}


export interface updatePermission {
    id: string;
    can_add: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

