import React from 'react';
import SearchBar from './SearchBar.jsx';
import CovidCircleUpdate from './CovidCircleUpdate.jsx';
import axios from 'axios';
import PaleDawn from './MapStyles/PaleDawn';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: [37.7749295, -122.4194155],
      data: [],
      map: {},
      covidCircleList: [],
      circle: null,
      radius: 40000,
      coveredCities: [],
      deleteButton: false,
      selectedCovidCircle: {},
    }
  }

  componentDidMount(){
    this.fetchCovidData()
  }

  fetchCovidData = () => {
    const endPoint = 'https://www.trackcorona.live/api/cities'
    axios.get(endPoint)
      .then((response) => {
        let filteredUS = response.data.data.filter((obj) => obj.country_code === "us")
        this.setState({
          data: filteredUS
        }, this.renderMap);
      })
      .catch((err) => {
        console.log("error", err)
      })
  }

  setUpMarkers (map){
    const {data} = this.state
    let covidCircleList = []
    let counter = 0;
    if (map){
      data.map(location => {
        const covidCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map,
          center: {lat: location.latitude, lng: location.longitude},
          radius: 700,
        });
        let tmp = { covidCircle, cases: location.confirmed, location: location.location }
        covidCircleList.push(tmp)

        google.maps.event.addListener(covidCircle, 'click', (e) => {
          const {covidCircleList} = this.state
          for (let i = 0; i < covidCircleList.length; i++){
            let item = covidCircleList[i]
            if(item.covidCircle === covidCircle){
              this.setState({
                deleteButton: true,
                selectedCovidCircle: {covidCircle, cases:item.cases, location:item.location}
              })
            }
          }
        })
      })
    }
    this.setState({ covidCircleList })
  }

  setUpListener(map){
    const {radius} = this.state

    let infoWindow = new google.maps.InfoWindow({
      content: "Click on map to see case count",
      position: {lat: this.state.currentLocation[0], lng: this.state.currentLocation[1]},
    });
    infoWindow.open(map);

    map.addListener("click", (mapsMouseEvent) => {
      const {circle} = this.state
      if(circle) circle.setMap(null)
      this.setUpAreaCaseCount( mapsMouseEvent.latLng, radius, map)
      infoWindow.close();
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      let total = this.addCasesInArea(radius)
      infoWindow.setContent( `Case Count: ${total}`);
      infoWindow.open(map);
    });
  }

  setUpAreaCaseCount(coor, radius, map){
    const circle = new google.maps.Circle({
      strokeColor: "Blue",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "blue",
      fillOpacity: 0.2,
      map,
      center: coor,
      radius,
    });
    this.setState({circle})
  }

  addCasesInArea(radius){
    const {covidCircleList, circle} = this.state
    const coveredCities = [];
    let total = 0;
    for (let i = 0; i < covidCircleList.length; i++){
     let data = covidCircleList[i];
     if(this.pointInCircle(data.covidCircle.center, radius, circle.center )){
       coveredCities.push(data.location)
       total += data.cases
     }
    }
    this.setState({coveredCities})
    return total
  }

  pointInCircle(point, radius, center) {
    return (window.google.maps.geometry.spherical.computeDistanceBetween(point, center) <= radius)
  }

  renderMap = () => {
    loadScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap`)
    window.initMap = this.initMap;
  }

  initMap = () => {
    const {data, radius} = this.state
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: this.state.currentLocation[0], lng: this.state.currentLocation[1]},
      zoom: 10,
      styles: PaleDawn,
      mapTypeControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.setState({map})
    this.setUpMarkers(map, data)
    this.setUpListener(map)
  }

  handleDeleteClick = () => {
    const {selectedCovidCircle, covidCircleList, map} = this.state
    selectedCovidCircle.covidCircle.setMap(null);
    for (let i = 0; i < covidCircleList.length; i++){
      let item = covidCircleList[i]
      if(item.covidCircle === selectedCovidCircle.covidCircle){
        item.cases = 0;
      }
    }
  }

  handleUpdateClick = (amount) => {
    const {selectedCovidCircle, covidCircleList, map} = this.state
    for (let i = 0; i < covidCircleList.length; i++){
      let item = covidCircleList[i]
      if(item.covidCircle === selectedCovidCircle.covidCircle){
        item.cases = +amount;
      }
    }
  }

  render() {
    const {data, deleteButton, selectedCovidCircle} = this.state
    return (
      <div>
      <div id="map"></div>
        { deleteButton && (
        <div>
          <CovidCircleUpdate
            info = {selectedCovidCircle}
            handleDeleteClick = {this.handleDeleteClick}
            handleUpdateClick = {this.handleUpdateClick}
            />
        </div>
        )
        }
        <SearchBar data = {data} />
      </div>
    );
  }
}

const loadScript = (url) => {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default Map