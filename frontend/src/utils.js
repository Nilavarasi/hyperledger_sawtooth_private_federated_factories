export const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user['token']){
        return true
    }
    return false
}

export const getUserID = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user['id']) return user['id']
    else return ''
}