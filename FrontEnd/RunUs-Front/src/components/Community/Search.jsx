import "../../styles/Community/Search.css";
import Button from "../../components/common/Button"; // Button 컴포넌트 임포트
import { FaSearch } from "react-icons/fa"

const Search = ({ query, onQueryChange, onSearch }) => {
  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          className="Article-search-bar"
          type="text"
          placeholder="검색어를 입력해 주세요"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <Button  
          className="search-button"
          onClick={handleSearch}
        >
          <FaSearch />
        </Button>
      </div>
    </div>
  );
};

export default Search;