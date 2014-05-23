<?php

    class Exception_Game extends Exception {
        
        protected $_severity = -99;
        
        public function __construct( $reason, $severity = SEVERITY_NONE, $previous = NULL ) {
            
            $this->_severity = $severity;
            
            parent::__construct( $reason, $severity, $previous );
        }
        
        public function getSeverity() {
            
            switch ( $this->_severity ) {
                
                case SEVERITY_DEBUG:
                    return 'debug';
                    break;
                
                case SEVERITY_NONE:
                    return 'none';
                    break;
                
                case SEVERITY_LOW:
                    return 'low';
                    break;
                
                case SEVERITY_MEDIUM:
                    return 'medium';
                    break;
                
                case SEVERITY_HIGH:
                    return 'high';
                    break;
                
                case SEVERITY_CRITICAL:
                    return 'critical';
                    break;
                
                default:
                    return 'unknown';
                    break;
                
            }
            
        }
        
        // Explains the exception in a programmer fashion way, usefull for debugging
        
        public function explain( $indent = 0 ) {
            $out = str_repeat( ' ', $indent );
            $out = $indent == 0 ? $out : $out . "└─▶ ";
            $out = $out . get_class( $this ) . ": " . $this->getMessage() . ", in \"" . trim( str_replace( PATH_ROOT, '', $this->getFile() ), '/' ) . "\", line ".$this->getLine();

            if ( $prev = $this->getPrevious() ) {
                if ( $prev instanceof Exception_Game ) {
                    $out = $out . "\n" . $prev->explain( $indent + 3 );
                } else {
                    $out = ( $out . "\n" . str_repeat( ' ', $indent + 3 ) . '└─▶ 0xFF - ' . get_class( $prev ) . ": " . $prev->getMessage() . ", in \"" . trim( str_replace( PATH_ROOT, '', $prev->getFile() ), '/' ) . "\", line " . $prev->getLine() );
                }
            }
            return $out;
        }
        
        
    }

?>