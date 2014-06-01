<div>
    <style>
        
        div.castle-{castle_id}-tabs .ui-tabs-panel.ui-widget-content {
            height: 370px;
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
            height: 120px;
            padding: 2px;
            border: 2px solid black;
            margin: 2px;
            cursor: pointer;
        }
        
        #castle-{castle_id}-build > .buildable > .title {
            display: block;
            padding: 4px;
            text-align: center;
            font-size: 12px;
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