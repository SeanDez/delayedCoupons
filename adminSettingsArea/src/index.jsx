import React from "react";
import ReactDOM from 'react-dom';
import TabSection from "./TabSection.jsx";

const AdminArea = props => {
  
  
  return (
    <div>
      <h1>All working</h1>
      <h2>update</h2>
      <h2>update 2</h2>
      <TabSection/>
    </div>
  );
};


ReactDOM.render(
  <AdminArea/>,
  document.getElementById('adminRoot')
  );

