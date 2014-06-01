<?php
    
    $index = ( 2 * 150 );
    
    for ( $row = 0; $row < 150; $row++ ) {
    
        for ( $col = 1; $col >= 0; $col-- ) {
            
            
            echo ".g-tbld.id-$index {\n    background-position: " , ( -$col * 150 ) , "px ", ( -$row * 70 ), "px;\n}\n\n";
            
            $index--;
        }
        
    }
    
?>