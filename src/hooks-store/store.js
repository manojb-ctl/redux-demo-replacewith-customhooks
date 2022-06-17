import { useState, useEffect } from "react";

let globalState = {};
let listeners = []; // for update all components (shared listeners)
let actions = {}; // dispatch action

// custom store...
export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1]; // updating func...

  // reducer func...
  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload); // reducer func..
    globalState = { ...globalState, ...newState };

    for (const listener of listeners) {
      listener(globalState);
    }
  };

  useEffect(() => {
    if (shouldListen) {
      listeners.push(setState);
    }

    // unmount components
    return () => {
      if (shouldListen) {
        listeners = listeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, initialState };
  }
  actions = { ...actions, ...userActions };
};
