import "../../styles/Community/ArticleList.css"
import { useState } from "react"

const Search = ({ query, onQueryChange }) => {
  return (
    <input
      className="Article-search-bar"
      type="text"
      placeholder="검색어를 입력해 주세요"
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
    />
  )
}

export default Search