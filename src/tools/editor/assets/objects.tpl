<div class="widget panel-objects" id="objects">
    <div class="scroller">
        <!-- BEGIN: object -->
        <div class="object" data-object-id="{id}">
            <img src="{src}" /><br />
            {name}
        </div>
        <!-- END: object -->
    </div>
    <div id="object-editor" class="unloaded">
        <div class="tabs">
            <ul>
                <li><a href="#object-editor-grid">Object</a></li>
                <li><a href="#object-editor-general">Properties</a></li>
            </ul>
            <div id="object-editor-general">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <td>Property</td>
                            <td>Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Label:</td>
                            <td><input type="text" data-property-name="object_caption" /></td>
                        </tr>
                        <tr>
                            <td>Object type:</td>
                            <td><input type="text" data-property-name="object_type" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td>Id:</td>
                            <td><input type="number" data-property-name="object_id" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td>Columns:</td>
                            <td><input type="number" data-property-name="object_cols" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td>Rows:</td>
                            <td><input type="number" data-property-name="object_rows" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td>Animated:</td>
                            <td><input type="checkbox" data-property-name="object_is_animated" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td># Frames:</td>
                            <td><input type="number" data-property-name="object_frames" disabled="disabled" /></td>
                        </tr>
                        <tr>
                            <td>HotSpot X:</td>
                            <td><input type="number" data-property-name="object_hsx" min="0" value="0" /></td>
                        </tr>
                        <tr>
                            <td>HotSpot Y:</td>
                            <td><input type="number" data-property-name="object_hsy" min="0" value="0" /></td>
                        </tr>
                        <tr>
                            <td>Enter X:</td>
                            <td><input type="number" data-property-name="object_epx" min="0" value="0" /></td>
                        </tr>
                        <tr>
                            <td>Enter Y:</td>
                            <td><input type="number" data-property-name="object_epy" min="0" value="0" /></td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
            <div id="object-editor-grid">
                <div id="object-grid-toolbar">
                    <div class="button" id="btn-set-hotspot">Hotspot</div>
                    <div class="button" id="btn-set-entrypoint">Enter</div>
                </div>
                <div id="object-grid-holder">
                    <table id="object-grid" class="no-guidelines">
                        <tbody>
                            <!-- BEGIN: collision_row --><tr class="r{row_index}">
                                <!-- BEGIN: collision_cell --><td class="c{col_index}" title="{col_index},{row_index}">
                                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQeCjcRVoZUgwAAAOhJREFUOMulUzsKAjEUnARLwcZC8AoewBN4E9HGE9h5Ay28gBcQwVoQK7Gws7ARERF0s41ZNj9jISu6ZuOKA49AyMw83psAf4LkeWStdZMJQeEHM+sypz7XtPN0IdHu79/uqKflj75ZFIOr2C+QRQaA8JtAQp6v3ANkXIBr4RZIyIPxGevD+XVwSYFFMa6pDgqv5O5oh4BRVMoEzeEG1VIRXCpEUoFL/ThdAgkCRiGMwvaoIYzBKbxA3jSEUc/SN+Ndm621JrbRW9ocyBapd2bPR75yRjm1RkKIP+3Ule+8fyQzib+K/IU7fwvOTNbA3EAAAAAASUVORK5CYII=" class="entrypoint"/>
                                </td><!-- END: collision_cell -->
                            <!-- END: collision_row -->
                        </tbody>
                    </table>
                </div>
                <br />
                <label><input type="checkbox" id="cmd-editor-toggle-borders" /> Show guides</label><br />
            </div>
        </div>
    </div>
</div>