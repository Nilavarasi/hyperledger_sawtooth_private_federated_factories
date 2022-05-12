export const isLoggedIn = () => {
    const user = localStorage.getItem('sec_user_public_key');
    if (user){
        return true
    }
    return false
}
