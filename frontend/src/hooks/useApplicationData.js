import { type } from "@testing-library/user-event/dist/type";
import { useState ,useReducer,useEffect} from "react";

const reducers = {
 
  setSidePeek(state,action) {
    return {...state, sidePeek: action.value};
  },
  setSampleDataForPhotoListItem(state,action) {
    return {...state, sampleDataForPhotoListItem: action.value};
  },
  toggleFavourite(state,action) {
    return {...state, favourite: action.value};
  },
  SET_PHOTO_DATA(state,action) {
    return {...state, photoData: action.value}
  },
  SET_TOPIC_DATA(state,action) {
    return {...state, topicData: action.value}
  },
}

const reducer = function (state, action) {  
  if(reducers[action.type]) {
    return reducers[action.type] (state, action)
  } else return state;
}

export default function useApplicationData () {  
  const [state, dispatch] = useReducer(reducer, {sidePeek: false,sampleDataForPhotoListItem: '', favourite: [], photoData: [],
  topicData: []});

  const setSidePeek = function (updatedSidePeek) {
    dispatch({type: 'setSidePeek',value:updatedSidePeek})
  };

  const setSampleDataForPhotoListItem = function (updateSampleData) {
    dispatch({type: 'setSampleDataForPhotoListItem', value: updateSampleData})
  };

  useEffect(() => {
    fetch("http://localhost:8001/api/photos")
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_PHOTO_DATA', value: data }))
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:8001/api/topics")
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'SET_TOPIC_DATA', value: data }))
  }, []);
  
  const toggleFavourite = (photoId) => {
    if (state.favourite.includes(photoId)) {
      const newFavourite = state.favourite.filter((id) => {
        return id != photoId
      })
      return dispatch({type:'toggleFavourite', value :newFavourite});
    } else {
      const newFavourite = [...state.favourite, photoId];
      return dispatch({type:'toggleFavourite', value :newFavourite});
    }
  };
  return {
    setSidePeek,
    sidePeek: state.sidePeek,
    setSampleDataForPhotoListItem,
    favourite: state.favourite,
    toggleFavourite,
    sampleDataForPhotoListItem: state.sampleDataForPhotoListItem,
    photos: state.photoData,
    topics: state.topicData   
  }
}