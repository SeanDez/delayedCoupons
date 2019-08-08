<!--outer div. inner heading and description-->

<div id="outerContainer">
  <div id="headingContainer">
    <h1>
      <?php echo $couponSettings['titleText'] ?>
    </h1>
  </div>
  
  <div id="descriptionContainer">
    <p>
      <?php echo $couponSettings['descriptionText'] ?>
    </p>
  </div>
</div>

<style>
  #outerContainer {
    height: 300px;
    width: 600px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;;
  }
</style>