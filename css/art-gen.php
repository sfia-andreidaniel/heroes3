<?php
    
    $index = ( 2 * 9 );
    
    for ( $row = 0; $row < 9; $row++ ) {
    
        for ( $col = 1; $col >= 0; $col-- ) {
            
            
            echo ".g-castle.id-$index {\n    background-position: " , ( -$col * 64 ) , "px ", ( -$row * 64 ), "px;\n}\n\n";
            
            $index--;
        }
        
    }
    
?>