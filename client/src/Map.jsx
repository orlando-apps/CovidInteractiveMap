import React from 'react';
import SearchBar from './SearchBar.jsx';
import CovidCircleUpdate from './CovidCircleUpdate.jsx';
import CircleCoverage from './CircleCoverage.jsx';
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
      addCovidPoint: true,
      covidCasesInput: 50,
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
    if (map){
      data.map(location => {
        const covidCircle = this.createCovidCircle(map, location.latitude,location.longitude, 700)
        this.createExistingCovidCircleListener(covidCircle)
        let tmp = { covidCircle, cases: location.confirmed, location: location.location }
        covidCircleList.push(tmp)
      })
    }
    this.setState({ covidCircleList })
  }

  createExistingCovidCircleListener(covidCircle){
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
  }

  createNewCovidCircleListener(covidCircle, location, cases){
    google.maps.event.addListener(covidCircle, 'click', (e) => {
      this.setState({
        deleteButton: true,
        selectedCovidCircle: {covidCircle, cases, location}
      })
    })
  }

  createCovidCircle(map, lat, lng, radius){
    const covidCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: {lat, lng},
      radius,
    });
    return covidCircle
  }

  setUpListener(map){
    let infoWindow = new google.maps.InfoWindow({
      content: "Click on map to see case count",
      position: {lat: this.state.currentLocation[0], lng: this.state.currentLocation[1]},
    });
    infoWindow.open(map);

    map.addListener("click", (mapsMouseEvent) => {
      const {circle, radius, addCovidPoint} = this.state
      if(circle) circle.setMap(null)

      if (addCovidPoint){
        const covidCircle = this.createCovidCircle(map, mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), 700)
        const address = this.getAddressFromCovidCircle(covidCircle)

      } else {
        this.setUpAreaCaseCount( mapsMouseEvent.latLng, radius, map)
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        let total = this.addCasesInArea(radius)
        infoWindow.setContent( `Case Count: ${total}`);
        infoWindow.open(map);
      }
    });
  }

  getAddressFromCovidCircle (covidCircle) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': covidCircle.center}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let location = results[0].formatted_address
          const { covidCircleList, covidCasesInput } = this.state
          let tmp = { covidCircle, cases: covidCasesInput, location }
          covidCircleList.push(tmp)
          this.setState({ covidCircleList })
          //this.createNewCovidCircleListener(covidCircle, location, covidCasesInput)
          this.createExistingCovidCircleListener(covidCircle)
        }
      }
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

  handleRadiusUpdate = (radius) =>{
    this.setState({radius})
  }

  toggleButton = () => {
    this.setState({addCovidPoint:!this.state.addCovidPoint});
  }

  handleCovidCasesInput = (event) => {
    this.setState({covidCasesInput: event.target.value});
  }

  render() {
    const {data, deleteButton, selectedCovidCircle, radius, covidCasesInput} = this.state
    return (
      <div>
        <div id="map"></div>
        <div className = 'container'>
          {this.state.addCovidPoint ? 'add Point': 'add coverage'}
          <div>
            <button onClick={this.toggleButton}>
              Toggle
            </button>
          <div>
          <CircleCoverage radius = {radius} handleRadiusUpdate = {this.handleRadiusUpdate}/>
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
                    <form>
                      <label>
                        Number of Covid Cases:
                        <input
                          type="number"
                          value={covidCasesInput}
                          onChange={this.handleCovidCasesInput} />
                      </label>
                    </form>
                  </div>
              </div>
          <SearchBar data = {data} />
        </div>
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