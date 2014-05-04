<?php

    require_once __DIR__ . '/bootstrap.php';
    
    try {
    
        $my = new Types();
        
        foreach ( $my as $obj ) {
            echo $obj->id, " ";
            $obj->fix();
            echo "\n";
        }
        
    } catch ( Exception_Game $e ) {
        echo $e->explain(), "\n";
    }

?>