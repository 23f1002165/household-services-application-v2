const store = new Vuex.Store({
    state : {
        auth_token : null,
        role : null,
        loggedIn : false,
        user_id : null,
    },
    mutations : {
        setUser(state) {
            try{
             if (JSON.parse(localStorage.getItem('user'))){
                const user = JSON.parse(localStorage.getItem('user'));
                state.auth_token = user.token;
                state.role = user.role;
                state.loggedIn = true;
                state.user_id = user.id;
                state.user_active = user.active;
             }
            } catch {
                console.warn('not logged in')
            }         
        },
        logout(state){
            state.auth_token = null;
            state.role = null;
            state.loggedIn = false;
            state.user_id = null;
            state.user_active = null;
            localStorage.removeItem('user')
        }
    },
    actions : {

    }
})
store.commit('setUser')

export default store;