<?php

require_once (ABSPATH . 'wp-admin/includes/upgrade.php');


class DataBase {
  
  public function initializeTables() {
    global $wpdb;
    $prefix = $wpdb->prefix;
    $charset_collate = $wpdb->get_charset_collate();
    
    $createCouponTableQuery = "CREATE TABLE IF NOT EXISTS {$prefix}delayedCoupons_coupons (
    couponId mediumint not null auto_increment,
    primary key (couponId),
    totalHits mediumInt not null,
    titleText varchar(250) not null,
    descriptionText varchar(1000) not null,
    titleTextColor varchar(50) not null,
    titleBackgroundColor varchar(50) not null,
    descriptionTextColor varchar(50) not null,
    descriptionBackgroundColor varchar(50) not null
    )";
    dbDelta($createCouponTableQuery);
    
    
    $createTargetTableQuery = "CREATE TABLE IF NOT EXISTS {$prefix}delayedCoupons_targets (
       targetId mediumint not null auto_increment unique,
       primary key (targetId),
       isSitewide tinyint(1) not null,
       targetUrl varchar(500),
       displayThreshold tinyint(5) not null default 20,
       offerCutoff tinyint(5),
       fk_coupons_targets mediumint not null unique,
       foreign key (fk_coupons_targets) references {$prefix}delayedCoupons_coupons(couponId) on delete cascade
      )";
    dbDelta($createTargetTableQuery);
  
  
    $createVisitsTableQuery = "CREATE TABLE IF NOT EXISTS {$prefix}delayedCoupons_visits (
    visitId mediumint(5) not null unique auto_increment,
    primary key (visitId),
    visitorId mediumInt(9) not null,
    urlVisited varchar(500) not null
    )";
    dbDelta($createVisitsTableQuery);
    
  }
  
  public function initializeDummyTable() {
    $query = "CREATE TABLE IF NOT EXISTS tableX (
    visitId mediumint(5) not null unique auto_increment,
    primary key (visitId),
    visitorId mediumInt(9) not null,
    urlVisited varchar(500) not null
    )";
    dbDelta($query);
  }
  
}