import React, { useState } from 'react';
import AutoComplete from './AutoComplete.jsx';
import classNames from 'classnames'

const SearchBar = (props) => {
  const {data} = props
  const [locationState, setLocationState] = useState('')
  const [locationCounty, setLocationCounty] = useState('')
  const [locationCovidCases, setLocationCovidCases] = useState(null)

  const tmpStateList = new Set()
  const tmpCountyList = new Set()

  for (let i = 0; i < data.length; i++){
    let obj = data[i]['location']
    let [county, state] = obj.split(', ')
    if (county && state){
      tmpStateList.add(state)
      tmpCountyList.add(county)
    }
  }
  const stateList =  [...tmpStateList]
  const countyList =  [...tmpCountyList]

  const updateCountyText = (county) => {
    setLocationCounty(county);
    findLocationData(locationState, county);
  }

  const updateStateText = (state) => {
    setLocationState(state);
    findLocationData(state, locationCounty);
  }

  const findLocationData = (inputState, inputCounty) =>{
      if(locationCounty.length > 0 &&  locationState.length > 0){
        for (let i = 0; i < data.length; i++){
          let obj = data[i]['location']
          let [county, state] = obj.split(', ')
          if ( county === inputCounty && state === inputState){
            let count = data[i]['confirmed']
            setLocationCovidCases(count.toLocaleString())
            return
          }
        }
        setLocationCovidCases(null)
      }
  }

  const autoClass1 = classNames("SearchBar", "top");
  const autoClass2 = classNames("SearchBar", "below");

  return (
    <div>
      <div className = "autoClass1" >
          <AutoComplete  data = {countyList} title = 'county' handle = {updateCountyText}/>
      </div>
      <div className = "autoClass2" >
          <AutoComplete data = {stateList} title = 'state' handle = {updateStateText} />
      </div>
        {locationCovidCases !== null ?  (<div><h3>Covid Cases: {locationCovidCases}</h3></div>) : null}
    </div>
  )
}

export default SearchBar