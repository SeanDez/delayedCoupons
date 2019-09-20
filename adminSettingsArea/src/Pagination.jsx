import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

export default props => {
  const {totalPages, setPageOffset} = props;
  const [activePage, setActivePage] = useState(1);
  
  
  /** Updates the page offset
   * In the parent this will trigger another useEffect to fire a new post request with the updated offset
   */
  useEffect(() => {
    console.log(activePage, `=====activePage=====`);
    setPageOffset((activePage * 10) - 10)
  }, [activePage]);
  
  
  const renderPageLinks = pageCount => {
    const jsxLinks = [];
    
    for (let i = 1; i <= totalPages; i++) {
      
      if (i === activePage) {
        jsxLinks.push(<ActivePage key={i}>{i}</ActivePage>)
      } else {
        jsxLinks.push(
          <MinimalButton
            key={i}
            onClick={() => setActivePage(i)}
          >
            {i}
          </MinimalButton>
        )
      }
    }
    
    return jsxLinks;
  };
  
  return (
    <OuterContainer>
      {activePage === 1 ?
       <DisabledButton>
         Previous
       </DisabledButton>
                                 :
       <MinimalButton
         onClick={() => setActivePage(prevState => prevState - 1)}
       >Previous</MinimalButton>
      }
      
      {renderPageLinks(totalPages)}
  
      {activePage === totalPages ?
       <DisabledButton
       >
         Next
       </DisabledButton>
                                 :
       <MinimalButton
         onClick={() => setActivePage(prevState => prevState + 1)}
       >Next</MinimalButton>
      }
    </OuterContainer>
  )
}


const OuterContainer = styled.div`
  max-width: 400px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 40px auto;
`;

const MinimalButton = styled.button`
  margin: 8px 5px;
  border : none;
  color: #0a5f10;
  cursor: pointer;
  &:hover {
    background-color: #c1e8ed;
    text-decoration: underline;
  }
`;

const ActivePage = styled(MinimalButton)`
  color: #32d771;
  border: 1px solid #32D771;
  border-radius: 2px;
  cursor: default;
  &:hover {
    background-color: inherit;
    text-decoration: none;
  }
`;

const DisabledButton = styled(MinimalButton)`
  color: #c3d3d7;
  cursor: not-allowed;
    &:hover {
    background-color: inherit;
    text-decoration: none;
  }
`;