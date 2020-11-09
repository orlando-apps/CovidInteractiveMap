import React, { useState } from 'react';
import AutoComplete from './AutoComplete.jsx';

const SearchBar = (props) => {
  const {data} = props
  const [locationState, setLocationState] = useState('')
  const [locationCounty, setLocationCounty] = useState('')

  const countyList =[];
  const tmpStateList = new Set()

  for (let i = 0; i < data.length; i++){
    let obj = data[i]['location']
    let [county, state] = obj.split(', ')
    if (county && state){
      countyList.push(county)
      tmpStateList.add(state)
    }
  }
  const stateList =  [...tmpStateList]

  return (
    <div className ='wrapper'>
      <div className = 'SearchBar' >
        <div>
          <AutoComplete  data = {countyList} title = 'county'/>
        </div>
      </div>
      <div className = 'SearchBar' >
        <div>
          <AutoComplete data = {stateList} title = 'state' />
        </div>
      </div>
    </div>
  )
}

export default SearchBar