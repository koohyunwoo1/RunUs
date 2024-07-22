import Header from "../../components/common/Header";
import "../../styles/Community/ArticleHome.css";
import ArticleList from "../../components/Community/ArticleList";
const ArticleHome = () => {

  const postsData = [
    { id: 1, title: 'React Tutorial', content: 'Learn React step by step.' },
    { id: 2, title: 'JavaScript Basics', content: 'Understand JavaScript fundamentals.' },
    { id: 3, title: 'Frontend vs Backend', content: 'Compare frontend and backend development.' },
    // 더 많은 데이터...
  ]

  return (
    <div>
      <Header />
      <h1 className="ArticleHome">
        <ArticleList data={postsData} />
      </h1>
    </div>
  );
};

export default ArticleHome;
