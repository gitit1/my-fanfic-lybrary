import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose , combineReducers } from 'redux';
import thunk from 'redux-thunk';


import * as serviceWorker from './serviceWorker';

import './index.css';

import App from './App';
import fandomsReducer from './store/reducers/fandomsReducer';
import fanficsReducer from './store/reducers/fanficsReducer';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
//const composeEnhancers = compose;

const rootReducer = combineReducers({
    fandoms:        fandomsReducer,
    fanfics:        fanficsReducer
});

const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk)
    ));
    
const app =(
    <Provider store={store}>
        <BrowserRouter>
                <App />
        </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
