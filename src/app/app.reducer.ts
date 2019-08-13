export interface State {
      isLogged: boolean;
}

const initialState: State = {
      isLogged: false
}

export function appReducer(state, action) {
      switch (action.type) {
            case 'IS_LOGGED':
                  return {
                        isLogged: true
                  };
            case 'NO_LOGGED':
                  return {
                        isLogged: false
                  };
            default:
                  return {
                        state
                  }
      }
}