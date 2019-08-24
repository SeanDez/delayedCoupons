<!--outer div. inner heading and description-->

<div id="outerContainer">
  <div id="headingContainer">
    <h1>
      <?php echo $couponSettings->titleText; ?>
    </h1>
  </div>
  
  <div id="descriptionContainer">
    <p>
      <?php echo $couponSettings->descriptionText; ?>
    </p>
  </div>
</div>

<style>
  #outerContainer {
    padding: 20px 60px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    position: fixed;
    bottom: 20px;
    right: 20px;
    border: 2px dashed <?php echo $couponSettings->descriptionTextColor; ?>
  }
  
  #headingContainer {
    background-color: <?php echo $couponSettings->titleBackgroundColor; ?>
  }
  #headingContainer h1 {
    color : <?php echo $couponSettings->titleTextColor; ?>
  }
  
  #descriptionContainer {
    background-color: <?php echo $couponSettings->descriptionBackgroundColor ?>;
  }
  #descriptionContainer h1 {
    color : <?php echo $couponSettings->descriptionTextColor; ?>
  }


</style>