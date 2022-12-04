import todopoderosoApi from "../../api/todopoderosoApi";

export const useApi = () => {

    const getInformationUser = async() => {
        const { data } = await todopoderosoApi.get('/manager/me');
        return data;
    };

    const postLoginUser = async( dataLogin ) => {
        const { data } = await todopoderosoApi.post('/login', dataLogin );
        return data;
    };

    const postRegisterUser = async( dataRegister ) => {
        await todopoderosoApi.post(
            '/register', 
            dataRegister
        );
    };

    return {
        //* Properties

        //*Methods
        getInformationUser,
        postLoginUser,
        postRegisterUser,
    }
}