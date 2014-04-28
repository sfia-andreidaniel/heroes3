<div class="widget" id="tools">
    <h2>Tools</h2>
    <div class="tabs" >
        <ul>
            <!-- BEGIN: layer -->
            <li><a href="#layer-{layer_id}">{layer_name}</a></li>
            <!-- END: layer -->
        </ul>
        <!-- BEGIN: tab -->
        <div id="layer-{layer_id}">
            <ul class="terrain-group">
                <!-- BEGIN: terrain -->
                <li class="terrain" data-brush="{layer_id}x{terrain_id}">
                    <img src="{terrain_icon}" />
                    {terrain_name}
                </li>
                <!-- END: terrain -->
            </ul>
        </div>
        <!-- END: tab -->
    </div>
</div>