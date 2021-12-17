import React from 'react';
import { CircleMarker, Map, Polyline, TileLayer, ZoomControl } from 'react-leaflet';
import { shapes } from '../shapes';
import { getDistance } from '../utils/getDistance';
import { Point } from '../utils/Point';

const THRESHOLD = 10;
const USE_MOUSE = true;

type IMapWrapperProps = {};

type IMapWrapperState = {
    center: Point;
    zoom: number;
    location: Point | null;
    points: Point[];
    pointId: number;
    drawing: boolean;
    wasCloseToStart: boolean;
};

export default class MapWrapper extends React.Component<IMapWrapperProps, IMapWrapperState> {
    state = {
        center: this.shape[0],
        zoom: 17,
        location: null,
        points: [] as Point[],
        pointId: 0,
        drawing: false,
        wasCloseToStart: false,
    };

    positionChanged(position: Point) {
        let toSet: any = {};
        if (this.state.drawing) {
            this.state.points.push(position);
            toSet.points = [...this.state.points];

            if (
                this.state.pointId < this.shape.length &&
                getDistance(position, this.shape[this.state.pointId]) < THRESHOLD
            ) {
                toSet.pointId = this.state.pointId + 1;
            }
        }
        if (!this.state.wasCloseToStart && getDistance(this.shape[0], position) <= THRESHOLD) {
            toSet.wasCloseToStart = true;
        }
        toSet.location = position;
        this.setState(toSet);
    }

    get shape() {
        return shapes.hvezda;
    }

    requestLocation = () => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(this.gotLocation, () => {
                console.error('Location error!');
            });
        }
    };

    gotLocation = (loc: GeolocationPosition) => {
        if (!USE_MOUSE) this.positionChanged([loc.coords.latitude, loc.coords.longitude]);
        this.requestLocation();
    };

    componentDidMount() {
        this.requestLocation();
    }

    render() {
        return (
            <>
                <Map
                    viewport={{ center: this.state.center, zoom: this.state.zoom }}
                    zoomControl={false}
                    onmousemove={(e) => {
                        if (USE_MOUSE) this.positionChanged([e.latlng.lat, e.latlng.lng]);
                    }}
                    onViewportChange={(e) => {
                        this.setState({ center: e.center!, zoom: e.zoom! });
                    }}
                    maxZoom={20}
                >
                    <ZoomControl position="topright" />
                    <TileLayer url="https://mapserver.mapy.cz/ophoto-m/{z}-{x}-{y}" opacity={0.3} />
                    <Polyline color="black" positions={this.shape.filter((val, i) => i <= this.state.pointId)} />
                    <Polyline color="#7579EE" positions={this.state.points} opacity={0.2} weight={30} />
                    {this.state.location && (
                        <CircleMarker
                            center={this.state.location!}
                            radius={15}
                            color="transparent"
                            fillColor="#7579EE"
                            fillOpacity={0.5}
                        ></CircleMarker>
                    )}
                    {this.state.pointId === 0 && (
                        <CircleMarker
                            center={this.shape[this.state.pointId]}
                            radius={15}
                            color="transparent"
                            fillColor="black"
                            fillOpacity={0.8}
                        ></CircleMarker>
                    )}

                    <img
                        src={process.env.PUBLIC_URL + '/assets/ostrovy-logo.png'}
                        alt="Ostrovy pohody"
                        className="logoOp"
                    />
                    <img src={process.env.PUBLIC_URL + '/assets/duha-logo.png'} alt="Duha AZ" className="logoDuha" />
                </Map>
                <div className="notification">
                    {this.state.drawing && this.state.pointId === this.shape.length && (
                        <div className="alert alert-primary" role="alert">
                            <p>Už jsi skoro u cíle! Až budeš chtít ukončit tvar, můžeš kliknout na tlačítko</p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.setState({ drawing: false })}
                            >
                                Dokončit obrazec
                            </button>
                        </div>
                    )}
                    {!this.state.drawing && this.state.pointId === 0 && this.state.wasCloseToStart && (
                        <div className="alert alert-primary" role="alert">
                            <p>Vítej! Už jsi skoro na startu. Až budeš chtít začít, můžeš kliknout na tlačítko</p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.setState({ drawing: true })}
                            >
                                Začít odkrývat
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
}
