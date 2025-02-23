import { Grid, Search } from "semantic-ui-react"
import {useReducer, useRef, useCallback, useEffect} from 'react'
import { useGetCommunitiesQuery } from "../features/api/apiSlice"
import _ from 'lodash'

const initialState = {
    loading: false,
    results: [],
    value: ''
}

function SearchReducer(state, action){
    switch(action.type){
        case 'CLEAN_QUERY':
            return initialState
        
        case 'START_SEARCH':
            return {loading: true, value: action.query}

        case 'FINISH_SEARCH':
            return {loading: false, results: action.results}

        default:
            throw new Error()
    }
}

const SearchCommunity = () => {

    const {data:communities, isSuccess} = useGetCommunitiesQuery()

    let source = []
    if(isSuccess){
        source = communities.map(m => (
            {
                'id': m.id,
                'title': m.communityname,
                'description': m.role,
            }
        ))
    }

    const [state, dispatch] = useReducer(SearchReducer, initialState)
    const {loading, results, value} = state

    const timeoutRef = useRef()
    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({type: 'START_SEARCH', query: data.value})

        timeoutRef.current = setTimeout(() => {
            if(data.value.length === 0){
                dispatch({type: 'CLEAN_QUERY'})
                return
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => re.test(result.title)

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(source, isMatch),
            })

        }, 300)
    }) 

    useEffect(() => {
        return() => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return(
             <Search
                loading={loading}
                placeholder="Search Community"
                onSearchChange={handleSearchChange}
                results={results}
                value={value}
                fluid
                size="large"
               
            />

       
    )

}

export default SearchCommunity