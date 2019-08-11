<!-- This File includes
      * Nonce generated in wordpress and injected into the js/client global scope
      * React.js file (bundle.js)
      
    React.js will use a placeholder if the nonce key isn't found. Load the nonce first
 -->

<div id="nonceCreator">
  <script>
    let _wpnonce = <?php echo json_encode(wp_create_nonce('wp_rest')); ?>;
    
    let cookiesArray = <?php echo json_encode($_COOKIE); ?>;
    
    let apiBaseUrl = "<?php echo get_rest_url(); ?>";
  </script>
</div>


<div id="reactScriptInjection">
  <div id="adminRoot"></div>
  <script src="<?php echo PLUGIN_FOLDER_URL . "shared/" ?>adminArea.bundle.js"></script>
</div>











