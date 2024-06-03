type Routes = {
    [key: string]: string;
}

export const apiRoutes: Routes = {
    logout: '/api/v1/user/logout',
    login: '/api/v1/user/login',
    signUp: '/api/v1/user/sign-up'
}