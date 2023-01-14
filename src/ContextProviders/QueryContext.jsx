import React, { useContext, useState } from 'react'

const QueryContext = React.createContext({ amountToFind: 6, fieldToSortBy: null, query: { type: null, field: null }, defaults: { amountToFind: 6, fieldToSortBy: null, query: { type: null, field: null }, increment: 2 } })
const QueryUpdateContext = React.createContext()

export function useQuery() {
    return useContext(QueryContext)
}

export function useQueryUpdate() {
    return useContext(QueryUpdateContext)
}

export default function QueryProvider({ children }) {
    const [query, setQuery] = useState({ amountToFind: 6, fieldToSortBy: null, query: { type: null, field: null }, defaults: { amountToFind: 6, fieldToSortBy: null, query: { type: null, field: null }, increment: 2 } })

    function ChangeQuery(newQuery) {
        setQuery(() => newQuery)
    }

    return (
        <QueryContext.Provider value={query}>
            <QueryUpdateContext.Provider value={ChangeQuery}>
                {children}
            </QueryUpdateContext.Provider>
        </QueryContext.Provider>
    )
}
