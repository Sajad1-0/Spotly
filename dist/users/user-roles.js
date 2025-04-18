"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.ROLES_WITH_PERMISSIONS = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Admin"] = "Admin";
    Role["User"] = "User";
})(Role || (exports.Role = Role = {}));
exports.ROLES_WITH_PERMISSIONS = {
    [Role.Admin]: ['user:create', 'user:read', 'user:update', 'user:delete',
        'room:create', 'room:read', 'room:update', 'room:delete'
    ],
    [Role.User]: ['user:read', 'room:read']
};
exports.ROLE_HIERARCHY = {
    [Role.Admin]: [Role.Admin, Role.User],
    [Role.User]: [Role.User]
};
