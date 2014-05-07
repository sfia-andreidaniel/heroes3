<div class="widget panel-erase" id="erase">

    <div class="form">
    
        <label>
            <span class="label">Erase on:</span>
            <select id="eraser-scope">
                <option value="*">All visible layers</option>
                <option value="">All layers (including invisible ones)</option>
                <!-- BEGIN: scope -->
                <option value="{layer_id}">{layer_name}</option>
                <!-- END: scope -->
            </select>
        </label>
        <label>
            <span class="label">Rubber size:</span>
            <select id="eraser-size">
                <option value="0">1x1 - Small</option>
                <option value="1">3x3 - Medium</option>
                <option value="2">5x5 - Large</option>
                <option value="3">7x7 - ExtraLarge</option>
            </select>
        </label>
    
    </div>
    
</div>