import Cookies from 'universal-cookie';

interface AuthTokenData {
    token: string | null;
    isLoggedIn: boolean;
}

const getAuthTokenFromCookie = (): AuthTokenData => {
    const cookies = new Cookies();
    const token = cookies.get('authToken');
    const isLoggedIn = !!token;
    
    return { token, isLoggedIn };
};

export default getAuthTokenFromCookie;
