import { useAuth } from './auth-provider';
import Authentication from '../pages/auth';

export const Perm = {
    CREATE_USER: 1,
    CREATE_ROLE: 2,
    CREATE_PLAYLIST: 3,
    VIEW_PLAYLIST: 4,
    OWN_PLAYLIST: 5,
    EDIT_PLAYLIST: 6,
    ACTIVATE_PLAYLIST: 7,
};

const checkBit = (dec, perm) => {
    if (!dec || !perm) return false;
    const binStr = (dec >>> 0).toString(2);
    const len = binStr.length;
    return binStr[len - perm] === '1';
};

export const checkPerm = (perm, user, item = {}) => {
    if (!perm || !user) return false;
    switch (perm) {
        case Perm.CREATE_ROLE:
            return user.roles.length >= 1 && checkBit(user.roles[0].permissions, Perm.CREATE_ROLE);
        case Perm.CREATE_PLAYLIST:
            return user.roles.length >= 1 && checkBit(user.roles[0].permissions, Perm.CREATE_PLAYLIST);
        case Perm.CREATE_USER:
            return user.roles.length >= 1 && checkBit(user.roles[0].permissions, Perm.CREATE_USER);
        case Perm.OWN_PLAYLIST:
            return item?.owner_id === user.id;
        case Perm.VIEW_PLAYLIST:
            return (
                checkPerm(Perm.OWN_PLAYLIST, user, item) ||
                item?.view.find(
                    (role) => role.user_id === user.id || user.roles.find((user_role) => user_role.id === role.id)
                )
            );
        case Perm.EDIT_PLAYLIST:
            return (
                checkPerm(Perm.OWN_PLAYLIST, user, item) ||
                item?.edit.find(
                    (role) => role.user_id === user.id || user.roles.find((user_role) => user_role.id === role.id)
                )
            );
        default:
            return false;
    }
};

const GrantAccess = ({ role, roles, children, item }) => {
    const { user } = useAuth();
    if (role && checkPerm(role, user, item)) {
        return children;
    } else if (roles) {
        let flag = false;
        let i = 0;
        while (!flag && i < roles.length) {
            if (checkPerm(roles[i], user, item)) {
                flag = true;
            }
            i++;
        }
        if (flag) return children;
    }
    return null;
};

export const LoginRequired = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Authentication redirect={children} />;
    else return children;
};

export default GrantAccess;
