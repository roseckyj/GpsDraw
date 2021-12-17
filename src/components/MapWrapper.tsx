import React from 'react';
import { CircleMarker, Map, Polyline, Popup, TileLayer, ZoomControl } from 'react-leaflet';
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
};

export default class MapWrapper extends React.Component<IMapWrapperProps, IMapWrapperState> {
    state = {
        center: this.shape[0],
        zoom: 17,
        location: null,
        points: [] as Point[],
        pointId: 0,
    };

    get drawEnabled() {
        return this.state.pointId < this.shape.length && this.state.pointId > 0;
    }

    positionChanged(position: Point) {
        let toSet: any = {};
        if (this.drawEnabled) {
            this.state.points.push(position);
            toSet.points = [...this.state.points];
        }
        if (
            this.state.pointId < this.shape.length &&
            getDistance(position, this.shape[this.state.pointId]) < THRESHOLD
        ) {
            toSet.pointId = this.state.pointId + 1;
        }
        toSet.location = position;
        this.setState(toSet);
    }

    get shape() {
        return shapes.snowman;
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
                {(this.state.pointId === this.shape.length || true) && (
                    <CircleMarker
                        center={this.shape[this.shape.length - 1]}
                        radius={15}
                        color="transparent"
                        fillOpacity={0}
                        isActive
                    >
                        <Popup closeOnEscapeKey={false} closeOnClick={false} autoClose={false} closeButton={false}>
                            Už jsi blízko konce, až budeš chtít, můžeš vypnout kreslení...
                        </Popup>
                    </CircleMarker>
                )}

                <img
                    src={process.env.PUBLIC_URL + '/assets/ostrovy-logo.png'}
                    alt="Ostrovy pohody"
                    className="logoOp"
                />
                <img src={process.env.PUBLIC_URL + '/assets/duha-logo.png'} alt="Duha AZ" className="logoDuha" />
            </Map>
        );
    }
}
