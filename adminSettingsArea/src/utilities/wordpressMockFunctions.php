<?php

function wp_send_json($data) {
  $encodedData = json_encode($data);
  return $encodedData;
}
