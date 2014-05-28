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
                <select id="objects-types">
                    <option value="*">Any</option>
                    <option value="">Not set</option>
                    <!-- BEGIN: object_type --><option value="{objectType}">{objectType}</option><!-- END: object_type -->
                </select>
            </label>
        </div>
    </div>
    <div class="scroller">
        <!-- BEGIN: object -->
        <div class="object" data-object-id="{id}" data-object-type="{type}" title="{id}">
            <img src="{src}" /><span>{name}</span>
        </div>
        <!-- END: object -->
    </div>
</div>