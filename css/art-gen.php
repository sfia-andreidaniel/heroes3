<?php
    
    $index = ( 3 * 3 );
    
    for ( $row = 0; $row < 3; $row++ ) {
    
        for ( $col = 2; $col >= 0; $col-- ) {
            
            
            echo ".g-res.id-$index {\n    background-position: " , ( -$col * 64 ) , "px ", ( -$row * 64 ), "px;\n}\n\n";
            $index--;
        }
        
    }
    
?>