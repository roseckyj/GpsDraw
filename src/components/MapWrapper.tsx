import React from 'react';
import { CircleMarker, Map, Polyline, TileLayer, ZoomControl } from 'react-leaflet';
import { getDistance } from '../utils/getDistance';
import { Point } from '../utils/Point';

const THRESHOLD = 5;

type IMapWrapperProps = {};

type IMapWrapperState = {
    center: Point;
    zoom: number;
    location: Point;
    points: Point[];
    pointId: number;
};

export default class MapWrapper extends React.Component<IMapWrapperProps, IMapWrapperState> {
    state = {
        center: [49.5609117, 15.9407] as Point,
        zoom: 17,
        location: [49.5609117, 15.9407] as Point,
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

    shape: Point[] = [
        [49.560361, 15.941539],
        [49.560353, 15.941695],
        [49.560309, 15.941829],
        [49.560183, 15.941898],
        [49.5601, 15.941834],
        [49.560068, 15.941652],
        [49.560134, 15.941491],
        [49.560235, 15.941448],
        [49.560312, 15.941491],
        [49.56034, 15.941491],
        [49.560058, 15.941169],
        [49.55994, 15.941163],
        [49.559838, 15.941292],
        [49.559863, 15.941512],
        [49.559943, 15.941593],
        [49.560037, 15.941587],
        [49.560093, 15.941507],
        [49.56011, 15.941378],
        [49.560089, 15.94126],
        [49.559916, 15.941652],
        [49.559856, 15.94178],
        [49.559797, 15.941925],
        [49.559727, 15.942059],
        [49.559672, 15.942199],
        [49.559616, 15.94229],
        [49.559568, 15.94236],
        [49.559557, 15.942488],
        [49.559616, 15.942596],
        [49.559706, 15.942606],
        [49.559741, 15.942542],
        [49.559769, 15.942446],
        [49.559787, 15.942338],
        [49.559682, 15.942242],
        [49.559814, 15.942301],
        [49.559902, 15.942129],
        [49.559943, 15.941995],
        [49.560002, 15.941898],
        [49.560058, 15.941727],
    ];

    render() {
        return (
            <Map
                viewport={{ center: this.state.center, zoom: this.state.zoom }}
                zoomControl={false}
                onmousemove={(e) => {
                    this.positionChanged([e.latlng.lat, e.latlng.lng]);
                }}
                onViewportChange={(e) => {
                    this.setState({ center: e.center!, zoom: e.zoom! });
                }}
                maxZoom={20}
            >
                <ZoomControl position="topright" />
                <TileLayer url="https://mapserver.mapy.cz/ophoto-m/{z}-{x}-{y}" opacity={0.3} />
                <Polyline color="black" positions={this.state.points} />
                <CircleMarker
                    center={this.state.location}
                    radius={10}
                    color="transparent"
                    fillColor="#7579EE"
                    fillOpacity={0.5}
                ></CircleMarker>
                {this.state.pointId < this.shape.length && (
                    <CircleMarker
                        center={this.shape[this.state.pointId]}
                        radius={10}
                        color="transparent"
                        fillColor="black"
                        fillOpacity={0.5}
                    ></CircleMarker>
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
