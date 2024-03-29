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
  
  <div
    id="closeButton"
  >X
  </div>
</div>

<script>
  const couponContainer = document.getElementById('outerContainer');
  const closeButton = document.getElementById('closeButton');
  
  function setDisplayToNone() {
    couponContainer.style.display = 'none';
  }
  
  const closeListenerOptions = {
    once : true
  };
  
  closeButton.addEventListener(
    'click',
    setDisplayToNone,
    closeListenerOptions
  );
</script>

<style>
  #outerContainer {
    z-index: 1001;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    position: fixed;
    bottom: 20px;
    right: 20px;
    <?php if (boolval($couponSettings->addCouponBorder) === true): ?>
    border: 2px dashed <?php echo $couponSettings->descriptionTextColor; ?>;
    border-radius: 2px;
    <?php endif; ?>
  }
  
  #headingContainer {
    background-color: <?php echo $couponSettings->titleBackgroundColor; ?>;
    padding: 20px 40px 0 40px;
  }
  #headingContainer h1 {
    color : <?php echo $couponSettings->titleTextColor; ?>
  }
  
  #descriptionContainer {
    background-color: <?php echo $couponSettings->descriptionBackgroundColor ?>;
    padding: 0 40px 20px 40px;
  }
  #descriptionContainer h1 {
    color : <?php echo $couponSettings->descriptionTextColor; ?>
  }

  #closeButton {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
</style>