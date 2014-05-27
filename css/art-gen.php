<?php
    
    $index = ( 3 * 57 );
    
    for ( $row = 0; $row < 57; $row++ ) {
    
        for ( $col = 2; $col >= 0; $col-- ) {
            
            
            echo "div.g-mon.id-$index: {\n    background-position: " , ( -$col * 64 ) , "px ", ( -$row * 64 ), "px;\n}\n\n";
            $index--;
        }
        
    }
    
?>