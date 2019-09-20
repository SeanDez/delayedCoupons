import React, {useState} from 'react';
import styled from 'styled-components';

export default props => {
  const {totalPages, setDataOffsetMultiplier} = props;
  
  const [activePage, setActivePage] = useState(1);
  
  const renderPageLinks = pageCount => {
    const jsxLinks = [];
    
    for (let i = 1; i <= totalPages; i++) {
      jsxLinks.push(
        <MinimalButton
          key={i}
          onClick={() => console.log(i, `=====i=====`)}
        >
          {i}
        </MinimalButton>
      )
    }
    
    return jsxLinks;
  };
  
  return (
    <OuterContainer>
      <MinimalButton>Previous</MinimalButton>
      {renderPageLinks(totalPages)}
      <MinimalButton>Next</MinimalButton>
    </OuterContainer>
  )
}


const OuterContainer = styled.div`
  max-width: 400px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  margin: 0 auto;
`;

const MinimalButton = styled.button`
  margin: 8px 5px;
  border : none;
  color: #0a5f10;
  cursor: pointer;
`;