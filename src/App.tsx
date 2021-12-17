import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import MapWrapper from './components/MapWrapper';
import './style.css';

export type AppState = {};

export class App extends React.Component<{}, AppState> {
    componentDidMount() {}

    render() {
        return <MapWrapper />;
    }
}
