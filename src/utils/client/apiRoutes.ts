type Routes = {
    [key: string]: string;
}

export const apiRoutes: Routes = {
    logout: '/api/v1/users/logout',
    login: '/api/v1/users/login',
    signUp: '/api/v1/users/sign-up'
}