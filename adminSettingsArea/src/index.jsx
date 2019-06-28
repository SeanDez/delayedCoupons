import React from "react";
import ReactDOM from 'react-dom';
import TabSection from "./TabSection.jsx";

const AdminArea = props => {
  
  
  return (
    <div>
      <TabSection/>
    </div>
  );
};


ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );

