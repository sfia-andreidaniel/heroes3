<div>
    <style>
        
        div.castle-{castle_id}-tabs .ui-tabs-panel.ui-widget-content {
            height: 375px;
            overflow-y: auto;
        }
        
        div.castle-{castle_id}-tabs .town-background {
            display: block;
            width: 800px;
            height: 374px;
            position: relative;
        }
        
        #castle-{castle_id}-build > .buildable {
            display: inline-block;
            width: 150px;
            height: 160px;
            padding: 2px;
            border: 2px solid black;
            margin: 2px;
            cursor: pointer;
            text-align: center;
            vertical-align: top;
        }
        
        #castle-{castle_id}-estates li {
            list-style-type: none;
        }
        
        #castle-{castle_id}-estates li > .g-res {
            vertical-align: bottom;
            margin: -15px;
            
            -webkit-transform: scale(.8, .8);
            -moz-transform: scale(.8, .8);
            -ms-transform: scale(.8, .8);
            -o-transform: scale(.8, .8);
            transform: scale(.8, .8);
            
            display: inline-block;
        }
        
        #castle-{castle_id}-build > .buildable > .g-tbld {
            margin: 0px auto;
            display: block;
        }
        
        #castle-{castle_id}-build > .buildable > .title {
            display: block;
            padding: 4px;
            text-align: center;
            font-size: 12px;
        }
        
        #castle-{castle_id}-build > .buildable > nobr {
            vertical-align: middle;
            display: inline;
        }
        
        #castle-{castle_id}-build > .buildable > nobr > .g-res {
            -webkit-transform: scale( .6, .6 );
            -o-transform: scale( .6, .6 );
            -ms-transform: scale( .6, .6 );
            -moz-transform: scale( .6, .6 );
            
            transform: scale( .6, .6 );
            
            margin: -22px;
            
            vertical-align: bottom;
            display: inline-block;
        }
        
        div.castle-1-tabs .town-background, div.castle-10-tabs .town-background {
            background-image: url( ../css/img/towns/castle.png );
        }

        div.castle-2-tabs .town-background, div.castle-11-tabs .town-background {
            background-image: url( ../css/img/towns/tower.png );
        }

        div.castle-3-tabs .town-background, div.castle-12-tabs .town-background {
            background-image: url( ../css/img/towns/inferno.png );
        }

        div.castle-4-tabs .town-background, div.castle-13-tabs .town-background {
            background-image: url( ../css/img/towns/fortress.png );
        }

        div.castle-5-tabs .town-background, div.castle-14-tabs .town-background {
            background-image: url( ../css/img/towns/rampart.png );
        }
        
        div.castle-6-tabs .town-background, div.castle-15-tabs .town-background {
            background-image: url( ../css/img/towns/dungeon.png );
        }
        
        div.castle-7-tabs .town-background, div.castle-16-tabs .town-background {
            background-image: url( ../css/img/towns/stronghold.png );
        }
        
        div.castle-8-tabs .town-background, div.castle-17-tabs .town-background {
            background-image: url( ../css/img/towns/necropolis.png );
        }
        
        div.castle-9-tabs .town-background, div.castle-18-tabs .town-background {
            background-image: url( ../css/img/towns/conflux.png );
        }
        
    </style>
    <div class="castle-{castle_id}-tabs">
        <ul>
            <li data-role="town"><a href="#castle-{castle_id}-town">Town</a></li>
            <li><a href="#castle-{castle_id}-estates">Estates</a></li>
            <li><a href="#castle-{castle_id}-build">Build</a></li>
            <li><a href="#castle-{castle_id}-armies">Armies</a></li>
            <li><a href="#castle-{castle_id}-spells">Spells</a></li>
        </ul>
        <div id="castle-{castle_id}-town">
            <div class="town-background id-{castle_type_id}">
            </div>
        </div>
        <div id="castle-{castle_id}-estates">
        
        </div>
        <div id="castle-{castle_id}-build">
        
        </div>
        <div id="castle-{castle_id}-armies">
        
        </div>
        <div id="castle-{castle_id}-spells">
        
        </div>
    </div>
</div>