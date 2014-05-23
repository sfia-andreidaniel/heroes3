<?php
    
    class Database extends BaseClass {
        
        // database connection names
        private static $dcns = [
            
        ];
        
        public static $cfg = [
        
        ];
        
        private static $cache = [
        
        ];
        
        private $dcn  = NULL;
        public $conn = NULL;
        
        public function __construct( $dcn ) {
        
            $this->dcn = $dcn;
        
            if ( !isset( self::$cfg[ $dcn ] ) )
                throw new Exception_Game( 'Database ' . $dcn . ' not configured!' );
        
            $this->conn = isset( self::$dcns[ $dcn ] )
                ? self::$dcns[ $dcn ]
                : self::$dcns[ $dcn ] = mysql_connect(
                    self::$cfg[ $dcn ][ 'host' ],
                    self::$cfg[ $dcn ][ 'user' ],
                    self::$cfg[ $dcn ][ 'password' ]
                );
            
            if ( !$this->conn )
                throw new Exception_Game("Failed to connect to database: " . $this->dcn );
            
            if ( !mysql_select_db( self::$cfg[ $dcn ][ 'database' ], $this->conn ) )
                throw new Exception_Game(
                    "Failed to select database " . self::$cfg[ $dcn ]['database'] 
                    . " for connection " . $this->dcn . ': ' . mysql_error( $this->conn )
                );
        }
        
        public function query( $sql ) {
            
            $result = mysql_query( $sql, $this->conn );
            
            if ( !$result )
                throw new Exception_Game( 'Failed to do mysql query: ' . $sql . ' on dcn: ' . $this->dcn . ": " . mysql_error( $this->conn ) );
            
            return $result;
            
        }
        
        public static function create( $dcn ) {
            
            if ( isset( self::$cache[ $dcn ] ) )
                return self::$cache[ $dcn ];
            
            self::$cache[ $dcn ] = new Database( $dcn );
            
            return self::$cache[ $dcn ];
        }
        
        public static function string( $value, $allowNull = FALSE ) {
            
            if ( $value )
                return '"' . mysql_real_escape_string( $value ) . '"';
            else {
                return $allowNull ? 'NULL' : '""';
            }
            
        }
        
        public static function boolint( $value, $allowNull = FALSE ) {
            
            if ( $value ) {
                return 1;
            } else {
            
                if  ($value === NULL && $allowNull )
                    return 'NULL';
                else
                    return 0;
            }
            
        }
        
        public static function int( $value, $allowNull = FALSE ) {
            
            if ( $value === NULL && $allowNull )
                return 'NULL';
            else {
                return (int)$value;
            }
            
        }
        
        public static function json( $value, $allowNull = FALSE ) {
            return "'" . mysql_real_escape_string( json_encode( $value ) ) . "'";
        }
        
        
    }
    
    function Database( $dcn ) {
        return Database::create( $dcn );
    }
    
    Database::$cfg = @json_decode( file_get_contents( __DIR__ . '/../cfg/databases.json' ), TRUE );
    
    if ( !is_array( Database::$cfg ) )
        throw new Exception_Game("Failed to prepare the databses: Configuration could not be loaded as json array!" );

?>