import { useDispatch, useSelector } from "react-redux";
import todopoderosoApi from "../api/todopoderosoApi";
import { onCheking, 
    onLogin, 
    onLogout, 
    onClearErrorMessage,
    /* onLogoutCalendar */ } from "../store";
import { useApi } from "./index";



export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const { getInformationUser, postLoginUser, postRegisterUser } = useApi(); 
    const dispatch = useDispatch();

    const startLogin = async( { username, password, interfaceAuth = 'default'} ) => {
        dispatch(onCheking());

        try {
            
            const  dataLogin  = await postLoginUser({ username, password, interfaceAuth });
            
            localStorage.setItem('token', dataLogin.token);

            const userData = await getInformationUser()
            
            const tokenInit = new Date( dataLogin.issuerDate );

            localStorage.setItem('token-init-date', tokenInit.getTime() ); 
            localStorage.setItem(
                'token-expired-date', 
                new Date().setTime( tokenInit.getTime() + dataLogin.expiresIn * 1000
            ) ); 

            dispatch( onLogin({ ...userData }) );
        } catch (error) {
            console.log(error);
            dispatch( onLogout('Credenciales incorrectas') );
            setTimeout(() => {
                dispatch( onClearErrorMessage() );
            }, 10);
        }
    };

    //! ---------- Registro: ----------
    const startRegister = async( { username, password, interfaceAuth } ) => {
        dispatch(onCheking());

        try {
            
            await postRegisterUser({ username, password, interfaceAuth })
            return startLogin({ username, password, interfaceAuth });

        } catch (error) {
            console.log(error);
            dispatch( onLogout( 
                error.response.data?.data?.messageText
                || ':/' 
            ));
            setTimeout(() => {
                dispatch( onClearErrorMessage() );
            }, 10);
        }
    };

    // Chequear token:
    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( onLogout());
        
        try {
            
            const expiredLocalDate = localStorage.getItem('token-expired-date');
            const expiredDate = new Date(expiredLocalDate);
            if ( !expiredDate ) return dispatch( onLogout()); // rari
            
            if ( expiredDate.getTime() < new Date().getTime() ){
                const { data } = await todopoderosoApi.post('/renew');

                const tokenInit = new Date( data.issuerDate );

                localStorage.setItem('token', data.token );
                localStorage.setItem('token-init-date', tokenInit.getTime() ); 
                localStorage.setItem(
                    'token-expired-date', 
                    new Date().setTime( tokenInit.getTime() + data.expiresIn * 1000
                ) );
            }
            
            const user = await getInformationUser()
            // console.log(user);
            dispatch( onLogin({ ...user }) );
        } catch (error) {
            console.log(error);
            localStorage.removeItem('token');
            localStorage.removeItem('token-init-date');
            localStorage.removeItem('token-expired-date');
            return dispatch( onLogout());
        }
    };

   
    
    const startLogout = ( ) => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-date');
        localStorage.removeItem('token-expired-date');
        // dispatch( onLogoutCalendar() );
        return dispatch( onLogout() );
    };

    return {
        //* Properties
        status,
        user,
        errorMessage,

        //*Methods
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
}