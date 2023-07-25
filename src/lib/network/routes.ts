
const prefix = 'api/v1';
export default {
    adminLoginEmail: `${prefix}/auth/admin/email/login`,
    userLoginEmail: `${prefix}/auth/email/login`,
    adminRegisterEmail: `${prefix}/auth/email/register/admin`,
    userRegisterEmail: `${prefix}/auth/email/register`,
    categories: `${prefix}/cards/categories`,
    subCategories: `${prefix}/cards/sub-categories`,
    allSubCategories: `${prefix}/cards/sub-categories/all`,
    openTrades: `${prefix}/trades/open`,
    assignedTrades: `${prefix}/trades/assigned`,
    assignTrades: `${prefix}/trades/assign`,
    trade: `${prefix}/trades`,
    users: `${prefix}/users`,
    wallet: `${prefix}/wallet`,
    banks:  `${prefix}/banks`,
}