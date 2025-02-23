import _ from "lodash"
import { useReducer, useCallback, useRef } from "react"
import { Search } from "semantic-ui-react"
import { useGetNotesQuery } from "../features/api/apiSlice"


const initialState = {
    loading: false,
    value: '',
    results: []
}

function searchReducer(state, action){
    switch(action.type){
        case 'CLEAN_QUERY':
            return initialState

        case 'START_SEARCH':
            return {...state, loading: true, value: action.query}

        case 'FINISH_SEARCH':
            return {...state, loading: false, results: action.results}

        case 'UPDATE_SELECTION':
            return {...state, value: action.selection }
            
        default:
            return new Error()
    }

}
const SearchNote = () => {

    const {data:sources, isSuccess} = useGetNotesQuery()
    let source 
    if(isSuccess){
         source = sources.filter(s => s.noteowner === sessionStorage.getItem("email"))
    }

    const [state, dispatch] = useReducer(searchReducer, initialState)
    const {loading, value, results} = state

    const timeoutRef = useRef()
    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.clearTimeout)
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
                results: _.filter(source, isMatch)
            })

        }, 300)
        
    }, [])

    return(
        <Search
            loading={loading}
            placeholder="search..."
            results={results}
            value={value}
            size="large"
            fluid
            onSearchChange={handleSearchChange}
            onResultSelect={(e, data) => 
                {dispatch({
                    type: 'UPDATE_SELECTION', 
                    selection: data.result.title
                });
                    sessionStorage.setItem("id", data.result.id) 
                }   
            }
        />
        
    )
}

export default SearchNote