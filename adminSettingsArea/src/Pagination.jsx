import React, {useState} from 'react';
import styled from 'styled-components';

export default props => {
  const {totalPages, setDataOffsetMultiplier} = props;
  
  const [activePage, setActivePage] = useState(1);
  
  const renderPageLinks = pageCount => {
    const jsxLinks = [];
    
    for (let i = 1; i <= totalPages; i++) {
      
      if (i === activePage) {
        jsxLinks.push(<DisabledButton key={i}>{i}</DisabledButton>)
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

const DisabledButton = styled(MinimalButton)`
  color: #c3d3d7;
  cursor: not-allowed;
    &:hover {
    background-color: inherit;
  }
`;