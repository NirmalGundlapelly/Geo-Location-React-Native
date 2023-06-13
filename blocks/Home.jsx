import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

Geocoder.init("AIzaSyA9mJZ_997tgVQAwSLlJGKNIlMAe0Xyqj4");

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef(null);
        this.state = {
            region: {
                latitude: 17.4508095,
                longitude: 78.3914771,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            marked: {
                latitude: 17.4508095,
                longitude: 78.3914771,
            },
            firsInput: '',
            secondInput: '',
            thirdInput: ''
        }
    }

    componentDidMount() {
        this.getLocationDetails()
        this.getCurrentPosition()
    }

    getCurrentPosition = () => {
        Geolocation.getCurrentPosition(info => this.setState({
            region: {
                latitude: info.coords.latitude, longitude: info.coords.longitude, latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, marked: { latitude: info.coords.latitude, longitude: info.coords.longitude}
        }));
    }

    getLocationDetails = () => {
        // const url =
        //     'https://maps.googleapis.com/maps/api/geocode/json?key=' +
        //     'AIzaSyA9mJZ_997tgVQAwSLlJGKNIlMAe0Xyqj4' +
        //     '&latlng=' +
        //     this.state.region.latitude +
        //     ',' +
        //     this.state.region.longitude;
        // fetch(url)
        //     .then(response => response.json())
        //     .then(response => {
        //         // console.log(response.results[0].formatted_address);
        //         console.log(response.results[0].formatted_address);
        //         const totalArray = response.results[0].formatted_address.split(',')
        //         console.log(totalArray)
        //         this.setState({ state: response.results[0].formatted_address[0] })
        //     });
        Geocoder.from(this.state.marked.latitude, this.state.marked.longitude,)
            .then(json => {
                var addressComponent = json.results[0].formatted_address;
                var details = addressComponent.split(',')
                var statePincode = details[details.length - 2].split(" ")
                getState = statePincode[1]
                getPincode = statePincode[2] == undefined ? '' : statePincode[2]
                firstDetails = details.splice(0, 2)
                secondDetails = details.splice(2, 3)
                console.log(secondDetails.join(''))
                this.setState({ firsInput: firstDetails.join(','), secondInput: secondDetails.join(','), thirdInput: getState + ', ' + getPincode })
            })
            .catch(error => console.warn(error));
    }


    onRegionChangeLocation = (location) => {
        this.setState({ region: location })
    }

    handleLocate = () => {
        this.getCurrentPosition()
        this.getLocationDetails()
    }



    render() {
        const { region, marked, state, firsInput, secondInput, thirdInput } = this.state
        // console.log(state)
        // console.log(firsInput)
        // console.log(secondInput)
        // console.log(thirdInput)
        return (
            <View style={styles.container}>
                {/*Render our MapView*/}
                <MapView
                    draggable
                    ref={this.mapRef}
                    style={styles.map}
                    showsUserLocation={true}
                    //specify our coordinates.
                    initialRegion={region}
                    //onRegionChangeComplete runs when the user stops dragging MapView
                    onRegionChange={() => this.onRegionChangeLocation}
                    onRegionChangeComplete={(region) => this.setState({ region })}
                    onPress={e => this.setState({
                        marked: {
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                        }
                    }, this.getLocationDetails)}
                >
                    <Marker draggable coordinate={marked} />
                </MapView>
                {/* <Text style={styles.text}>Current latitude: {marked.latitude}</Text>
                <Text style={styles.text}>Current longitude: {marked.longitude}</Text> */}
                <TouchableOpacity onPress={this.handleLocate} style={{ marginBottom: 10, marginLeft: 300, backgroundColor: 'white', padding: 10, borderRadius: 5 }}><Text style={{ color: '#e05e2b', fontWeight: '700' }}>LOCATE</Text></TouchableOpacity>
                <View style={styles.addressContainer}>
                    <TextInput style={styles.input} value={firsInput} />
                    <TextInput style={styles.input} value={secondInput} />
                    <TextInput style={styles.input} value={thirdInput} />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.confirmButton}><Text style={{ color: 'white', fontWeight: '600' }}>CONFIRM LOCATION</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1, //the container will fill the whole screen.
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    addressContainer: {
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        padding: 10,
    },
    input: {
        borderColor: '#d7dade',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 5,
        backgroundColor: '#f0f2f5',
        padding: 10,
        color: '#75716d'
    },
    confirmButton: {
        backgroundColor: '#e05e2b',
        padding: 15,
        width: Dimensions.get('window').width / 1.1,
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 8
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,

    }
});


