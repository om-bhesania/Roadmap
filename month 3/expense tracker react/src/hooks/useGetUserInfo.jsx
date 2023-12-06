export const useGetUserInfo = () => {
    const {
        isLoggedIn,
        sessionId,
        name,
        email,
        uniqueUserId,
        picture
    } = JSON.parse(localStorage.getItem("AuthKey")
    );
    return { isLoggedIn, sessionId, name, email, uniqueUserId, picture }
}