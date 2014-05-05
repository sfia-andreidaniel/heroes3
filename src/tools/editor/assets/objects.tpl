<div class="widget panel-objects" id="objects">
    <div class="filterer">
        <div class="form">
            <label>
                <span class="label">Search:</span>
                <input type="search" id="objects-filter" />
            </label>
        </div>
        <div class="form">
            <label>
                <span class="label">Object type:</span>
                <select id="objects-keyword">
                    <option value="">Any</option>
                    <option value="artifact">Artifact</option>
                </select>
            </label>
        </div>
    </div>
    <div class="scroller">
        <!-- BEGIN: object -->
        <div class="object" data-object-id="{id}">
            <img src="{src}" /><br />
            {name}
        </div>
        <!-- END: object -->
    </div>
</div>