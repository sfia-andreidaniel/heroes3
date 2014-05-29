<div class="widget panel-towns" id="towns">
    <div id="town-faction-selector">
        <label>
            <span>Starting Faction:</span>
            <select>
                <option value="">[ None ]</option>
                <!-- BEGIN: faction --><option value="{faction_id}">{faction_name}</option><!-- END: faction -->
            </select>
        </label>
    </div>
    <h3>{group}</h3>
        <!-- BEGIN: town -->
        <div class="town" data-item-id="{town_id}">
            <div class="g-castle id-{town_id}"></div>
            {name}{withFort}
        </div>
        <!-- END: town -->
</div>