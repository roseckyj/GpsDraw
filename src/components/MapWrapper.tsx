import axios from 'axios';
import React from 'react';
import { CircleMarker, Map, Polyline, TileLayer, ZoomControl } from 'react-leaflet';
import { shapes } from '../shapes';
import { getDistance } from '../utils/getDistance';
import { Point } from '../utils/Point';

const THRESHOLD = 10;
const USE_MOUSE = (document.URL.split('#').length > 1 ? document.URL.split('#')[1] : '').includes('&mouse');
const FUTURE_POINTS = 4;
const API = 'https://gps-draw.herokuapp.com';

type IMapWrapperProps = {};

type IMapWrapperState = {
    center: Point;
    zoom: number;
    location: Point | null;
    points: Point[];
    pointId: number;
    drawing: boolean;
    wasCloseToStart: boolean;
    error: string | null;
    nickname: string;
    completed: boolean;
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
        error: null,
        nickname: '',
        completed: false,
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
        const shapename = (document.URL.split('#').length > 1 ? document.URL.split('#')[1] : '').split('&')[0];
        const available = ', dostupné tvary jsou ' + Object.keys(shapes).join(', ');
        if (shapename.length === 0) {
            this.setState({ error: 'V adrese chybí název tvaru' + available });
            return [];
        }
        if (!shapes[shapename]) {
            this.setState({ error: 'Vybraný tvar neexistuje' + available });
            return [];
        }
        return shapes[shapename];
    }

    requestLocation = () => {
        if (!navigator.geolocation) {
            this.setState({ error: 'Zařízení nepodporuje sledování polohy' });
        } else {
            navigator.geolocation.getCurrentPosition(this.gotLocation, () => {
                this.setState({ error: 'Přístup k poloze byl odepřen' });
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
        if (this.state.error) {
            return (
                <div className="errorWrapper">
                    <div className="alert alert-danger" role="alert">
                        <p>Vypadá to, že se něco nepovedlo. Prosím obnovte stránku a zkuste to znovu.</p>
                        <p>
                            <strong>{this.state.error}</strong>
                        </p>
                        <button type="button" className="btn btn-danger" onClick={() => window.location.reload()}>
                            Obnovit stránku
                        </button>
                    </div>
                </div>
            );
        }

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
                    <Polyline
                        color="black"
                        positions={this.shape.filter((val, i) => i <= this.state.pointId - FUTURE_POINTS)}
                    />
                    <Polyline
                        color="black"
                        positions={this.shape.filter(
                            (val, i) => i <= this.state.pointId && i >= this.state.pointId - FUTURE_POINTS,
                        )}
                        className="dashed"
                    />
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
                            <p>
                                Už jsi skoro u cíle! Až budeš chtít ukončit tvar, můžeš kliknout na tlačítko a dokončit
                                obrazec
                            </p>
                            <p>Abychom věděli, kdo nám to nakreslil, napiš nám, prosím, svoje jméno</p>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Tvoje křestní jméno"
                                    onChange={(event) => this.setState({ nickname: event.target.value })}
                                    value={this.state.nickname}
                                />
                                <label htmlFor="floatingInput">Tvoje křestní jméno</label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    axios
                                        .post(
                                            `${API}/save`,
                                            {
                                                points: this.state.points,
                                                shape: this.shape,
                                                nickname: encodeURIComponent(this.state.nickname),
                                            },
                                            {},
                                        )
                                        .then(function (response) {
                                            console.log(response);
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                    this.setState({ drawing: false, completed: true });
                                }}
                            >
                                Dokončit obrazec
                            </button>
                        </div>
                    )}
                    {!this.state.drawing && this.state.pointId === 0 && this.state.wasCloseToStart && (
                        <div className="alert alert-primary" role="alert">
                            <p>
                                Vítej! Už jsi skoro na startu. Až budeš chtít začít, můžeš kliknout na tlačítko a začít
                                objevovat
                            </p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.setState({ drawing: true })}
                            >
                                Začít odkrývat
                            </button>
                        </div>
                    )}
                    {this.state.completed && (
                        <div className="alert alert-success" role="alert">
                            Gratulujeme! Můžeš se vrátit k ohni a ukázat nám, co jsi zvládl(a) objevit.
                        </div>
                    )}
                </div>
            </>
        );
    }
}
