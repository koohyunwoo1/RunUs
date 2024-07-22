import "../../styles/Community/ArticleList.css"
import Button from "../../components/common/Button"
import ArticleItem from "../../components/Community/ArticleItem"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/common/Header"
import Search from "./Search"

const ArticleList = ({data}) => {
  
  const [ query, setQuery ] = useState('')
  const nav = useNavigate()

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <Header />
      <div className="ArticleList">
        <div className="article_wrapper">
          <Search query={query} onQueryChange={setQuery} />
          <ul>
            {filteredData.length > 0 ? (
              filteredData.map(post => (
                <ArticleItem key={post.id} {...post}/>
                // <li key={post.id}>
                //   <h2>{post.title}</h2>
                //   <p>{post.content}</p>
                // </li>
              ))
            ) : (
              <p>No posts found</p>
            )}
          </ul>
          <Button text={"글 쓰기"} />
        </div>
      </div>
    </div>
  )
};

export default ArticleList;
